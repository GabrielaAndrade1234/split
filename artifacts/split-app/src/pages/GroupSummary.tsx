import React from "react";
import { Link, useParams } from "wouter";
import { useGetGrupoResumo } from "@workspace/api-client-react";
import { TopBar, BottomNav, formatCurrency, formatDate, AvatarInitials } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ArrowDownLeft, Loader2, ArrowRight } from "lucide-react";

export default function GroupSummary() {
  const params = useParams();
  const id = Number(params.id);
  const { data: resumo, isLoading } = useGetGrupoResumo(id, {
    query: { enabled: !!id, queryKey: ["/api/grupos", id, "resumo"] }
  });

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] bg-background pb-20">
        <TopBar title="Carregando..." backTo="/" />
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!resumo) return null;

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <TopBar title={resumo.nome} backTo="/" />
      
      <div className="mx-auto max-w-md p-4 space-y-6">
        
        {/* Main Balances */}
        <div className="bg-card border border-border rounded-[12px] p-6 text-center shadow-sm">
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">Gasto total do grupo</p>
          <h2 className="text-4xl font-bold tracking-tight mb-6">{formatCurrency(resumo.saldoTotal)}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-success/10 rounded-[8px] p-3 border border-success/20">
              <div className="flex items-center justify-center text-success mb-1">
                <ArrowDownLeft className="h-4 w-4 mr-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Você recebe</span>
              </div>
              <p className="font-bold text-success text-lg">{formatCurrency(resumo.aReceber)}</p>
            </div>
            
            <div className="bg-destructive/10 rounded-[8px] p-3 border border-destructive/20">
              <div className="flex items-center justify-center text-destructive mb-1">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span className="text-xs font-bold uppercase tracking-wider">Você paga</span>
              </div>
              <p className="font-bold text-destructive text-lg">{formatCurrency(resumo.aPagar)}</p>
            </div>
          </div>
        </div>

        {/* Quem deve para quem mini */}
        {resumo.transferencias && resumo.transferencias.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Quem deve para quem</h3>
              <Link href={`/grupos/${id}/dividas`} className="text-sm text-primary font-bold">Ver tudo</Link>
            </div>
            
            <div className="bg-card border border-border rounded-[12px] divide-y divide-border overflow-hidden shadow-sm">
              {resumo.transferencias.slice(0, 3).map((t, i) => (
                <div key={i} className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{t.pagadorNome}</span>
                    <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                    <span className="font-medium text-sm">{t.recebedorNome}</span>
                  </div>
                  <span className="font-bold">{formatCurrency(t.valor)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Despesas Recentes */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Despesas recentes</h3>
            <Link href={`/grupos/${id}/despesas`} className="text-sm text-primary font-bold">Ver tudo</Link>
          </div>
          
          <div className="space-y-2">
            {resumo.despesasRecentes && resumo.despesasRecentes.length > 0 ? (
              resumo.despesasRecentes.slice(0, 5).map((d) => (
                <div key={d.id} className="bg-card border border-border rounded-[12px] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AvatarInitials name={d.pagadorNome} className="h-10 w-10 text-sm" />
                    <div>
                      <p className="font-bold">{d.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.pagadorNome} pagou • {formatDate(d.dataCriacao)}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">{formatCurrency(d.valor)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-card border border-border rounded-[12px]">
                <p>Nenhuma despesa ainda.</p>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-[80px] md:bottom-[96px] right-4 md:right-[calc(50%-224px+16px)] z-40">
        <Link href={`/grupos/${id}/despesas/nova`}>
          <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </div>

      <BottomNav groupId={id} />
    </div>
  );
}
