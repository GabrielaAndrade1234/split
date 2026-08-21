import React, { useState } from "react";
import { useLocation } from "wouter";
import { useCreateGrupo } from "@workspace/api-client-react";
import { TopBar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Users, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListGruposQueryKey } from "@workspace/api-client-react";

export default function CreateGroup() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [nome, setNome] = useState("");
  const [participanteInput, setParticipanteInput] = useState("");
  const [participantes, setParticipantes] = useState<string[]>(["Eu"]);
  
  const createGrupo = useCreateGrupo();

  const addParticipante = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (participanteInput.trim() && !participantes.includes(participanteInput.trim())) {
      setParticipantes([...participantes, participanteInput.trim()]);
      setParticipanteInput("");
    }
  };

  const removeParticipante = (nome: string) => {
    setParticipantes(participantes.filter(p => p !== nome));
  };

  const handleSave = () => {
    if (!nome.trim() || participantes.length < 2) return;
    
    createGrupo.mutate(
      { data: { nome: nome.trim(), participantes } },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: getListGruposQueryKey() });
          setLocation(`/grupos/${data.id}`);
        }
      }
    );
  };

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopBar title="Novo grupo" backTo="/" />
      
      <div className="mx-auto max-w-md p-4 space-y-6 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Nome do grupo</label>
          <Input 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Viagem para praia, Jantar..."
            className="text-lg py-6 rounded-[4px]"
            autoFocus
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-foreground uppercase tracking-wider">Quem participou?</label>
          
          <form onSubmit={addParticipante} className="flex gap-2">
            <Input 
              value={participanteInput}
              onChange={(e) => setParticipanteInput(e.target.value)}
              placeholder="Nome da pessoa..."
              className="rounded-[4px]"
            />
            <Button type="submit" variant="secondary" className="rounded-[4px] px-3">
              <Plus className="h-5 w-5" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {participantes.map((p) => (
              <div 
                key={p} 
                className="flex items-center bg-card border border-border px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {p}
                {p !== "Eu" && (
                  <button 
                    onClick={() => removeParticipante(p)}
                    className="ml-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {participantes.length < 2 && (
            <p className="text-sm text-destructive flex items-center mt-2">
              <Users className="h-4 w-4 mr-1" />
              Adicione pelo menos mais uma pessoa
            </p>
          )}
        </div>

        <div className="pt-8">
          <Button 
            onClick={handleSave} 
            disabled={!nome.trim() || participantes.length < 2 || createGrupo.isPending}
            size="lg" 
            className="w-full rounded-[12px] font-bold"
          >
            {createGrupo.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            Criar grupo
          </Button>
        </div>
      </div>
    </div>
  );
}
