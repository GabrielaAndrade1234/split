import React, { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useGetGrupo, useCreateDespesa, DespesaInputCategoria } from "@workspace/api-client-react";
import { TopBar, AvatarInitials } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Utensils, Car, Home, Ticket, ShoppingBag, Box, Loader2, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  { id: DespesaInputCategoria.restaurante, icon: <Utensils className="h-5 w-5" />, label: "Comida" },
  { id: DespesaInputCategoria.transporte, icon: <Car className="h-5 w-5" />, label: "Viagem" },
  { id: DespesaInputCategoria.hospedagem, icon: <Home className="h-5 w-5" />, label: "Hospedagem" },
  { id: DespesaInputCategoria.lazer, icon: <Ticket className="h-5 w-5" />, label: "Lazer" },
  { id: DespesaInputCategoria.compras, icon: <ShoppingBag className="h-5 w-5" />, label: "Compras" },
  { id: DespesaInputCategoria.outros, icon: <Box className="h-5 w-5" />, label: "Outros" },
];

export default function CreateExpense() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: grupo, isLoading: loadingGrupo } = useGetGrupo(id, {
    query: { enabled: !!id, queryKey: ["/api/grupos", id] }
  });

  const createDespesa = useCreateDespesa();

  const [descricao, setDescricao] = useState("");
  const [valorStr, setValorStr] = useState("");
  const [categoria, setCategoria] = useState<DespesaInputCategoria>(DespesaInputCategoria.outros);
  const [pagadorId, setPagadorId] = useState<number | null>(null);
  const [participanteIds, setParticipanteIds] = useState<number[]>([]);

  // Initialize all participants selected
  React.useEffect(() => {
    if (grupo && participanteIds.length === 0 && pagadorId === null) {
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
        
        {/* Descrição e Valor */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">O que é?</label>
            <Input 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Jantar"
              className="text-lg py-6 rounded-[4px]"
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
              className="text-lg py-6 rounded-[4px] text-right font-bold"
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
            className="w-full rounded-[12px] font-bold h-14 text-lg"
          >
            {createDespesa.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Salvar despesa
          </Button>
        </div>

      </div>
    </div>
  );
}
