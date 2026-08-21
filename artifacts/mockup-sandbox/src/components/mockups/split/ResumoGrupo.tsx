import { Home, List, Users, Settings, Plus, Menu, ChevronDown, ChevronRight, UtensilsCrossed, Car } from "lucide-react";

export function ResumoGrupo() {
  return (
    <div
      className="flex flex-col bg-[#F5F6FA] min-h-screen w-full font-['Inter']"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center px-5 pt-3 pb-1 bg-white text-[#111827] text-xs font-bold">
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="3" width="3" height="9" rx="1" fill="#111827"/><rect x="4.5" y="2" width="3" height="10" rx="1" fill="#111827"/><rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#111827"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111827"/></svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 2.5C10.2 2.5 12.2 3.4 13.7 4.9L15.1 3.5C13.2 1.6 10.7 0.5 8 0.5C5.3 0.5 2.8 1.6 0.9 3.5L2.3 4.9C3.8 3.4 5.8 2.5 8 2.5Z" fill="#111827"/><path d="M8 5.5C9.4 5.5 10.7 6.1 11.6 7L13 5.6C11.7 4.3 9.9 3.5 8 3.5C6.1 3.5 4.3 4.3 3 5.6L4.4 7C5.3 6.1 6.6 5.5 8 5.5Z" fill="#111827"/><circle cx="8" cy="10" r="1.5" fill="#111827"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#111827" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="8" rx="2" fill="#111827"/><path d="M23 4.5V7.5C23.8 7.2 24.5 6.4 24.5 6C24.5 5.6 23.8 4.8 23 4.5Z" fill="#111827" fillOpacity="0.4"/></svg>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
          <Menu size={22} color="#111827" />
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="text-[17px] font-bold text-[#111827]">Viagem Praia</span>
            <ChevronDown size={16} color="#5F6B7A" />
          </div>
          <span className="text-xs text-[#5F6B7A]">5 participantes</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5B3FA8]">
          <Plus size={20} color="white" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Saldo do grupo card */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col items-center pb-3 border-b border-gray-100">
            <span className="text-[13px] text-[#5F6B7A] mb-1">Saldo do grupo</span>
            <span className="text-[32px] font-bold text-[#111827] leading-tight">R$ 756,40</span>
            <span className="text-[12px] text-[#5F6B7A] mt-0.5">devem ser acertados</span>
          </div>
          <div className="flex mt-3 gap-3">
            <div className="flex-1 bg-[#F0FDF7] rounded-xl p-3 flex flex-col items-center">
              <span className="text-[11px] text-[#047A45] font-medium mb-1">A receber</span>
              <span className="text-[16px] font-bold text-[#047A45]">R$ 438,20</span>
            </div>
            <div className="flex-1 bg-[#FEF2F2] rounded-xl p-3 flex flex-col items-center">
              <span className="text-[11px] text-[#C62828] font-medium mb-1">A pagar</span>
              <span className="text-[16px] font-bold text-[#C62828]">R$ 318,20</span>
            </div>
          </div>
        </div>

        {/* Quem deve para quem */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[14px] font-bold text-[#111827]">Quem deve para quem</span>
          </div>
          <div className="space-y-2">
            {[
              { from: "Ana", to: "Gabi", amount: "R$ 120,00" },
              { from: "Bruno", to: "Gabi", amount: "R$ 90,00" },
              { from: "Clara", to: "Ana", amount: "R$ 88,20" },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#111827]">{row.from}</span>
                  <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
                    <path d="M1 5H19M19 5L15 1M19 5L15 9" stroke="#5B3FA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[14px] text-[#111827]">{row.to}</span>
                </div>
                <span className="text-[14px] font-bold text-[#C62828]">{row.amount}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full flex items-center justify-center">
            <span className="text-[13px] text-[#5B3FA8] font-medium">Ver todas as dívidas</span>
          </button>
        </div>

        {/* Despesas recentes */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[14px] font-bold text-[#111827]">Despesas recentes</span>
            <button><span className="text-[13px] text-[#5B3FA8] font-medium">Ver todas</span></button>
          </div>
          <div className="space-y-1">
            {/* Restaurante */}
            <div className="flex items-center gap-3 py-2.5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] flex items-center justify-center shrink-0">
                <UtensilsCrossed size={18} color="#5B3FA8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#111827] truncate">Restaurante beira-mar</div>
                <div className="text-[12px] text-[#5F6B7A]">Gabi pagou · Ontem</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold text-[#111827]">R$ 185,00</span>
                <ChevronRight size={16} color="#5F6B7A" />
              </div>
            </div>
            {/* Uber */}
            <div className="flex items-center gap-3 py-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F0F4FF] flex items-center justify-center shrink-0">
                <Car size={18} color="#5B3FA8" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#111827] truncate">Uber para pousada</div>
                <div className="text-[12px] text-[#5F6B7A]">Bruno pagou · Ontem</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-bold text-[#111827]">R$ 62,40</span>
                <ChevronRight size={16} color="#5F6B7A" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-gray-200 flex items-center px-2 pb-2 pt-1">
        {[
          { icon: Home, label: "Resumo", active: true },
          { icon: List, label: "Despesas", active: false },
          { icon: Users, label: "Pessoas", active: false },
          { icon: Settings, label: "Ajustes", active: false },
        ].map(({ icon: Icon, label, active }) => (
          <button key={label} className="flex-1 flex flex-col items-center gap-0.5 py-1">
            <Icon size={22} color={active ? "#5B3FA8" : "#9CA3AF"} fill={active && label === "Resumo" ? "#5B3FA8" : "none"} />
            <span className={`text-[11px] font-medium ${active ? "text-[#5B3FA8]" : "text-[#9CA3AF]"}`}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
