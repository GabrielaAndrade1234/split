import React, { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useListDespesas, useGetGrupo } from "@workspace/api-client-react";
import { TopBar, BottomNav, formatCurrency, formatDate, AvatarInitials } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Utensils, Car, Home, Ticket, ShoppingBag, Box } from "lucide-react";

export function getCategoryIcon(cat: string) {
  switch(cat) {
    case 'restaurante': return <Utensils className="h-4 w-4" />;
    case 'transporte': return <Car className="h-4 w-4" />;
    case 'hospedagem': return <Home className="h-4 w-4" />;
    case 'lazer': return <Ticket className="h-4 w-4" />;
    case 'compras': return <ShoppingBag className="h-4 w-4" />;
    default: return <Box className="h-4 w-4" />;
  }
}

export default function ExpenseList() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  
  const { data: grupo, isLoading: loadingGrupo } = useGetGrupo(id, {
    query: { enabled: !!id, queryKey: ["/api/grupos", id] }
  });
  
  const { data: despesas, isLoading: loadingDespesas } = useListDespesas(id, {
    query: { enabled: !!id, queryKey: ["/api/grupos", id, "despesas"] }
  });

  const isLoading = loadingGrupo || loadingDespesas;

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <TopBar title="Todas as despesas" backTo={`/grupos/${id}`} />
      
      <div className="mx-auto max-w-md p-4 space-y-4 pt-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !despesas || despesas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <Box className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Nenhuma despesa</h2>
            <p className="text-muted-foreground mb-8">
              Adicione a primeira despesa do grupo.
            </p>
            <Button 
              size="lg" 
              className="rounded-[12px] font-bold"
              onClick={() => setLocation(`/grupos/${id}/despesas/nova`)}
            >
              <Plus className="mr-2 h-5 w-5" /> Adicionar despesa
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {despesas.map((d) => (
              <div key={d.id} className="bg-card border border-border rounded-[12px] p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted/30 rounded-full flex items-center justify-center text-muted-foreground">
                      {getCategoryIcon(d.categoria)}
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight">{d.descricao}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(d.dataCriacao)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-lg">{formatCurrency(d.valor)}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                  <div className="flex items-center text-xs">
                    <span className="text-muted-foreground mr-1">Pago por</span>
                    <span className="font-bold text-foreground">{d.pagadorNome}</span>
                  </div>
                  <div className="flex items-center -space-x-2">
                    {d.participantes.slice(0, 3).map((p, i) => (
                      <AvatarInitials key={p.id} name={p.nome} className="h-6 w-6 text-[10px] ring-2 ring-card" />
                    ))}
                    {d.participantes.length > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold ring-2 ring-card z-10">
                        +{d.participantes.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isLoading && despesas && despesas.length > 0 && (
        <div className="fixed bottom-[80px] md:bottom-[96px] right-4 md:right-[calc(50%-224px+16px)] z-40">
          <Link href={`/grupos/${id}/despesas/nova`}>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
              <Plus className="h-7 w-7" />
            </Button>
          </Link>
        </div>
      )}

      <BottomNav groupId={id} />
    </div>
  );
}
