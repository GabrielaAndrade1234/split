import React from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Receipt, Wallet, Users, ChevronLeft } from "lucide-react";

export function BottomNav({ groupId }: { groupId: number }) {
  const [matchResumo] = useRoute("/grupos/:id");
  const [matchDespesas] = useRoute("/grupos/:id/despesas");
  const [matchDividas] = useRoute("/grupos/:id/dividas");

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-2 md:pb-4 z-50">
      <div className="mx-auto flex max-w-md items-center justify-around">
        <Link 
          href={`/grupos/${groupId}`}
          className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[80px] ${
            matchResumo ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wallet className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Resumo</span>
        </Link>
        <Link 
          href={`/grupos/${groupId}/despesas`}
          className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[80px] ${
            matchDespesas ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Despesas</span>
        </Link>
        <Link 
          href={`/grupos/${groupId}/dividas`}
          className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[80px] ${
            matchDividas ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Dívidas</span>
        </Link>
      </div>
    </div>
  );
}

export function TopBar({ title, backTo, action }: { title: string; backTo?: string; action?: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex max-w-md h-14 items-center justify-between px-4">
        {backTo ? (
          <Link href={backTo} className="flex h-10 w-10 items-center justify-center -ml-2 rounded-full hover:bg-muted/10">
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </Link>
        ) : (
          <div className="w-8" />
        )}
        <h1 className="text-lg font-bold text-foreground truncate max-w-[200px]">{title}</h1>
        <div className="w-8 flex justify-end">
          {action}
        </div>
      </div>
    </div>
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(dateString));
}

export function AvatarInitials({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
    
  return (
    <div className={`flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold ${className}`}>
      {initials}
    </div>
  );
}
