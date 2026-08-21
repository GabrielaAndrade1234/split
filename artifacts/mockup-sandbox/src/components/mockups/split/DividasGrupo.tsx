import { ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";

export function DividasGrupo() {
  return (
    <div
      className="flex flex-col bg-[#F5F6FA] min-h-screen w-full"
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
      <div className="flex items-center px-4 py-3 bg-white border-b border-gray-100">
        <button className="w-9 h-9 flex items-center justify-center mr-2">
          <ChevronLeft size={24} color="#111827" />
        </button>
        <span className="text-[17px] font-bold text-[#111827] flex-1 text-center pr-9">Dívidas do grupo</span>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex bg-[#EDEDF3] rounded-xl p-1">
          <button className="flex-1 py-2 rounded-[10px] bg-[#5B3FA8] text-white text-[14px] font-bold">
            Simplificado
          </button>
          <button className="flex-1 py-2 text-[#5F6B7A] text-[14px] font-medium">
            Detalhado
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {/* Pague estas pessoas */}
        <div>
          <span className="text-[13px] font-bold text-[#5F6B7A] uppercase tracking-wide">Pague estas pessoas</span>
          <div className="mt-2 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Row: Gabi */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <ArrowUp size={18} color="#C62828" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#111827]">Você deve para Gabi</div>
                <div className="text-[18px] font-bold text-[#C62828] mt-0.5">R$ 120,00</div>
              </div>
              <ChevronRight size={18} color="#9CA3AF" />
            </div>
            {/* Row: Ana */}
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-9 h-9 rounded-full bg-[#FEF2F2] flex items-center justify-center shrink-0">
                <ArrowUp size={18} color="#C62828" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#111827]">Você deve para Ana</div>
                <div className="text-[18px] font-bold text-[#C62828] mt-0.5">R$ 88,20</div>
              </div>
              <ChevronRight size={18} color="#9CA3AF" />
            </div>
          </div>
        </div>

        {/* Você vai receber de */}
        <div>
          <span className="text-[13px] font-bold text-[#5F6B7A] uppercase tracking-wide">Você vai receber de</span>
          <div className="mt-2 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Row: Bruno */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-full bg-[#F0FDF7] flex items-center justify-center shrink-0">
                <ArrowDown size={18} color="#047A45" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#111827]">Bruno deve para você</div>
                <div className="text-[18px] font-bold text-[#047A45] mt-0.5">R$ 90,00</div>
              </div>
              <ChevronRight size={18} color="#9CA3AF" />
            </div>
            {/* Row: Clara */}
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-9 h-9 rounded-full bg-[#F0FDF7] flex items-center justify-center shrink-0">
                <ArrowDown size={18} color="#047A45" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium text-[#111827]">Clara deve para você</div>
                <div className="text-[18px] font-bold text-[#047A45] mt-0.5">R$ 60,00</div>
              </div>
              <ChevronRight size={18} color="#9CA3AF" />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 bg-white border-t border-gray-100">
        <button className="w-full bg-[#5B3FA8] text-white text-[16px] font-bold py-4 rounded-xl">
          Marcar pagamento
        </button>
      </div>
    </div>
  );
}
