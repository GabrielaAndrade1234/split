import React, { useState } from "react";
import { Link, useParams } from "wouter";
import { useListDividas, useMarcarPagamento } from "@workspace/api-client-react";
import { TopBar, BottomNav, formatCurrency } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownLeft, ArrowUpRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getListDividasQueryKey, getGetGrupoResumoQueryKey } from "@workspace/api-client-react";

export default function DebtList() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();
  
  const { data: dividas, isLoading } = useListDividas(id, {
    query: { enabled: !!id, queryKey: getListDividasQueryKey(id) }
  });

  const marcarPagamento = useMarcarPagamento();

  const handleMarcarPagamento = (pagadorId: number, recebedorId: number, valor: number) => {
    marcarPagamento.mutate(
      { id, data: { pagadorId, recebedorId, valor } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDividasQueryKey(id) });
          queryClient.invalidateQueries({ queryKey: getGetGrupoResumoQueryKey(id) });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background pb-20">
        <TopBar title="Dívidas do grupo" backTo={`/grupos/${id}`} />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background pb-24">
      <TopBar title="Dívidas" backTo={`/grupos/${id}`} />
      
      <div className="mx-auto max-w-md p-4 pt-4">
        
        <Tabs defaultValue="simplificado" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-[8px] bg-muted/20">
            <TabsTrigger value="simplificado" className="rounded-[6px] font-bold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground uppercase text-xs tracking-wider">
              Simplificado
            </TabsTrigger>
            <TabsTrigger value="detalhado" className="rounded-[6px] font-bold data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground uppercase text-xs tracking-wider">
              Histórico
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="simplificado" className="space-y-4">
            {!dividas?.transferencias || dividas.transferencias.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-success/50" />
                <p className="font-bold text-foreground">Tudo certo por aqui!</p>
                <p className="text-sm mt-1">Ninguém deve nada para ninguém no grupo.</p>
              </div>
            ) : (
              dividas.transferencias.map((t, i) => (
                <div key={i} className="bg-card border border-border rounded-[12px] p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                        <ArrowUpRight className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">
                          <span className="text-foreground">{t.pagadorNome}</span>
                          <span className="text-muted-foreground font-normal mx-1">deve para</span>
                          <span className="text-foreground">{t.recebedorNome}</span>
                        </p>
                        <p className="font-bold text-destructive mt-0.5">{formatCurrency(t.valor)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleMarcarPagamento(t.pagadorId, t.recebedorId, t.valor)}
                    disabled={marcarPagamento.isPending}
                    variant="outline"
                    className="w-full font-bold h-10 border-primary text-primary hover:bg-primary/10 rounded-[8px]"
                  >
                    Marcar como pago
                  </Button>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="detalhado" className="space-y-3">
            {!dividas?.pagamentos || dividas.pagamentos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum pagamento registrado ainda.
              </div>
            ) : (
              dividas.pagamentos.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-[12px] p-4 flex items-center justify-between opacity-70">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-success/20 rounded-full flex items-center justify-center text-success">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {p.pagadorNome} pagou {p.recebedorNome}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(p.dataCriacao))}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">{formatCurrency(p.valor)}</span>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

      </div>
      
      <BottomNav groupId={id} />
    </div>
  );
}
