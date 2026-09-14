import React, { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useGetGrupo, useCreateDespesa, DespesaInputCategoria, useAnalyzeExpenseWithAi, AiExpenseAnalysis } from "@workspace/api-client-react";
import { TopBar, AvatarInitials } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Utensils, Car, Home, Ticket, ShoppingBag, Box, Loader2, Check, Sparkles, Send, AlertCircle, Cpu, Zap, Coins, DollarSign, BarChart3, PiggyBank, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  { id: DespesaInputCategoria.restaurante, icon: <Utensils className="h-5 w-5" />, label: "Comida" },
  { id: DespesaInputCategoria.transporte, icon: <Car className="h-5 w-5" />, label: "Viagem" },
  { id: DespesaInputCategoria.hospedagem, icon: <Home className="h-5 w-5" />, label: "Hospedagem" },
  { id: DespesaInputCategoria.lazer, icon: <Ticket className="h-5 w-5" />, label: "Lazer" },
  { id: DespesaInputCategoria.compras, icon: <ShoppingBag className="h-5 w-5" />, label: "Compras" },
  { id: DespesaInputCategoria.outros, icon: <Box className="h-5 w-5" />, label: "Outros" },
];

function formatUsd(value: number, decimalPlaces: number) {
  return `US$ ${value.toFixed(decimalPlaces).replace(".", ",")}`;
}

export default function CreateExpense() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: grupo, isLoading: loadingGrupo } = useGetGrupo(id, {
    query: { enabled: !!id, queryKey: ["/api/grupos", id] }
  });

  const createDespesa = useCreateDespesa();
  const analyzeExpense = useAnalyzeExpenseWithAi();

  const [descricao, setDescricao] = useState("");
  const [valorStr, setValorStr] = useState("");
  const [categoria, setCategoria] = useState<DespesaInputCategoria>(DespesaInputCategoria.outros);
  const [pagadorId, setPagadorId] = useState<number | null>(null);
  const [participanteIds, setParticipanteIds] = useState<number[]>([]);

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState<AiExpenseAnalysis | null>(null);
  const initializedGroupId = React.useRef<number | null>(null);

  // Initialize all participants selected
  React.useEffect(() => {
    if (grupo && initializedGroupId.current !== grupo.id) {
      initializedGroupId.current = grupo.id;
      setParticipanteIds(grupo.participantes.map(p => p.id));
      if (grupo.participantes.length > 0) {
        setPagadorId(grupo.participantes[0].id);
      }
    }
  }, [grupo]);

  const toggleParticipante = (pId: number) => {
    if (participanteIds.includes(pId)) {
      setParticipanteIds(participanteIds.filter(id => id !== pId));
    } else {
      setParticipanteIds([...participanteIds, pId]);
    }
  };

  const handleAnalyze = () => {
    if (!aiPrompt.trim()) return;
    setAiAnalysis(null); // Clear previous analysis
    analyzeExpense.mutate(
      { id, data: { prompt: aiPrompt } },
      {
        onSuccess: (data) => {
          setAiAnalysis(data);
          const { suggestion } = data;
          setDescricao(suggestion.descricao);
          setValorStr(suggestion.valor.toFixed(2).replace('.', ','));
          const suggestedCategory = CATEGORIES.find(
            category => category.id === suggestion.categoria,
          );
          setCategoria(suggestedCategory?.id ?? DespesaInputCategoria.outros);
          const suggestedPayer = grupo?.participantes.find(
            participant => participant.id === suggestion.pagadorId,
          );
          if (suggestedPayer) {
            setPagadorId(suggestedPayer.id);
          }
          if (suggestion.participanteIds && suggestion.participanteIds.length > 0) {
            const validParticipantIds = new Set(
              grupo?.participantes.map(participant => participant.id) ?? [],
            );
            setParticipanteIds(
              suggestion.participanteIds.filter(participantId =>
                validParticipantIds.has(participantId),
              ),
            );
          }
        },
      }
    );
  };

  const handleSave = () => {
    const valor = parseFloat(valorStr.replace(',', '.'));
    if (!descricao.trim() || isNaN(valor) || valor <= 0 || !pagadorId || participanteIds.length === 0) return;
    
    createDespesa.mutate(
      { 
        id, 
        data: { 
          descricao: descricao.trim(), 
          valor, 
          pagadorId, 
          participanteIds,
          categoria
        } 
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/grupos", id] });
          setLocation(`/grupos/${id}`);
        }
      }
    );
  };

  const isFormValid = descricao.trim() && parseFloat(valorStr.replace(',', '.')) > 0 && pagadorId && participanteIds.length > 0;

  if (loadingGrupo) {
    return (
      <div className="min-h-[100dvh] bg-background">
        <TopBar title="Nova despesa" backTo={`/grupos/${id}`} />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-8">
      <TopBar title="Nova despesa" backTo={`/grupos/${id}`} />
      
      <div className="mx-auto max-w-md p-4 space-y-6 pt-6">
        
        {/* AI Integration Box */}
        <div className="bg-primary/5 border border-primary/20 rounded-[12px] p-4 space-y-3 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 p-3 opacity-[0.03] pointer-events-none">
            <Sparkles className="w-32 h-32" />
          </div>
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Preencher com Inteligência Artificial
          </h3>
          <div className="flex gap-2 relative">
            <Input 
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="Ex: Paguei 120 no jantar, divide com a Maria"
              className="bg-background rounded-[8px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze();
              }}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={analyzeExpense.isPending || !aiPrompt.trim()}
              className="rounded-[8px]"
            >
              {analyzeExpense.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          
          {analyzeExpense.isError && (
            <div className="text-xs text-destructive flex items-center gap-1.5 font-medium bg-destructive/10 p-2.5 rounded-[8px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Não foi possível entender a despesa. Verifique os participantes e tente novamente.
            </div>
          )}

          {aiAnalysis && (
            <div className="mt-4 text-xs space-y-3 border-t border-primary/10 pt-3 relative animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-2 text-primary-foreground bg-primary p-2.5 rounded-[8px]">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">
                  {aiAnalysis.suggestion.explicacao}
                </span>
                <button onClick={() => setAiAnalysis(null)} className="ml-auto opacity-70 hover:opacity-100">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground mt-2">
                <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5"/> {aiAnalysis.model}</span>
                {aiAnalysis.cached && <span className="flex items-center gap-1.5 text-success font-medium"><Zap className="w-3.5 h-3.5"/> Cache rápido</span>}
                <span className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5"/> {aiAnalysis.usage.totalTokens} tokens</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Custo: {formatUsd(aiAnalysis.usage.estimatedCostUsd, 7)}</span>
                <span className="flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5"/> {formatUsd(aiAnalysis.usage.costPerThousandCallsUsd, 4)} por 1.000 chamadas</span>
                {aiAnalysis.savedCostUsd > 0 && (
                  <span className="flex items-center gap-1.5 text-success font-medium"><PiggyBank className="w-3.5 h-3.5"/> Economia: {formatUsd(aiAnalysis.savedCostUsd, 7)}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Descrição e Valor */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">O que é?</label>
            <Input 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Jantar"
              className="text-lg py-6 rounded-[8px]"
            />
          </div>
          <div className="w-1/3 space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Valor (R$)</label>
            <Input 
              type="text"
              inputMode="decimal"
              value={valorStr}
              onChange={(e) => setValorStr(e.target.value)}
              placeholder="0,00"
              className="text-lg py-6 rounded-[8px] text-right font-bold"
            />
          </div>
        </div>

        {/* Categoria */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Categoria</label>
          <div className="grid grid-cols-3 gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-[8px] border transition-all ${
                  categoria === c.id 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-card border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {c.icon}
                <span className="text-[10px] font-bold mt-1.5 uppercase tracking-wider">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quem pagou */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Quem pagou?</label>
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x">
            {grupo?.participantes.map((p) => {
              const isSelected = pagadorId === p.id;
              return (
                <button
                  key={`pagador-${p.id}`}
                  onClick={() => setPagadorId(p.id)}
                  className="flex flex-col items-center flex-shrink-0 snap-start"
                >
                  <div className={`relative rounded-full transition-all ${isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-70 grayscale"}`}>
                    <AvatarInitials name={p.nome} className="h-14 w-14 text-lg" />
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium max-w-[64px] truncate ${isSelected ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                    {p.nome}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Para quem (participantes) */}
        <div className="space-y-3 bg-card border border-border p-4 rounded-[12px]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dividir entre</label>
            <button 
              onClick={() => {
                if (participanteIds.length === grupo?.participantes.length) {
                  setParticipanteIds([]);
                } else {
                  setParticipanteIds(grupo?.participantes.map(p => p.id) || []);
                }
              }}
              className="text-xs text-primary font-bold uppercase tracking-wider"
            >
              {participanteIds.length === grupo?.participantes.length ? "Desmarcar todos" : "Marcar todos"}
            </button>
          </div>
          
          <div className="space-y-3">
            {grupo?.participantes.map((p) => (
              <div key={`part-${p.id}`} className="flex items-center space-x-3">
                <Checkbox 
                  id={`part-${p.id}`} 
                  checked={participanteIds.includes(p.id)}
                  onCheckedChange={() => toggleParticipante(p.id)}
                  className="rounded-[4px] h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label 
                  htmlFor={`part-${p.id}`} 
                  className="flex-1 text-sm font-medium leading-none cursor-pointer py-1"
                >
                  {p.nome}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <Button 
            onClick={handleSave} 
            disabled={!isFormValid || createDespesa.isPending}
            size="lg" 
            className="w-full rounded-[12px] font-bold h-14 text-lg shadow-sm"
          >
            {createDespesa.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Salvar despesa
          </Button>
        </div>

      </div>
    </div>
  );
}
