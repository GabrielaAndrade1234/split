import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useListGrupos } from "@workspace/api-client-react";
import { TopBar, formatCurrency } from "@/components/layout";
import { Users, Plus, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GroupList() {
  const { data: grupos, isLoading } = useListGrupos();

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      <TopBar title="Seus grupos" />
      
      <div className="mx-auto max-w-md p-4 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Carregando grupos...</p>
          </div>
        ) : grupos?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold mb-2">Nenhum grupo</h2>
            <p className="text-muted-foreground mb-8 max-w-[250px]">
              Você ainda não tem nenhum grupo de despesas.
            </p>
            <Link href="/grupos/novo">
              <Button size="lg" className="rounded-[12px] font-bold w-full max-w-[200px]">
                <Plus className="mr-2 h-5 w-5" /> Novo grupo
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {grupos?.map((grupo) => (
                <Link key={grupo.id} href={`/grupos/${grupo.id}`}>
                  <div className="bg-card border border-border p-4 rounded-[12px] hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{grupo.nome}</h3>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{grupo.totalParticipantes} participantes</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="pt-6">
              <Link href="/grupos/novo">
                <Button size="lg" className="rounded-[12px] font-bold w-full">
                  <Plus className="mr-2 h-5 w-5" /> Novo grupo
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
