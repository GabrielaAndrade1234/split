import { ChevronLeft, Check } from "lucide-react";

const MEMBERS = [
  { name: "Gabi", initials: "G", color: "#C084FC", bg: "#FAF5FF" },
  { name: "Ana",  initials: "A", color: "#F472B6", bg: "#FDF2F8" },
  { name: "Bruno", initials: "B", color: "#60A5FA", bg: "#EFF6FF" },
  { name: "Clara", initials: "C", color: "#34D399", bg: "#F0FDF4" },
  { name: "Você",  initials: "V", color: "#94A3B8", bg: "#F8FAFC" },
];

const PAYER = "Gabi"; // selected payer
const PARTICIPANTS_CHECKED = ["Gabi", "Ana", "Bruno"];

export function NovaDespesa() {
  return (
    <div
      className="flex flex-col bg-white min-h-screen w-full"
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
      <div className="flex items-center px-4 py-3 border-b border-gray-100">
        <button className="w-9 h-9 flex items-center justify-center mr-2">
          <ChevronLeft size={24} color="#111827" />
        </button>
        <span className="text-[17px] font-bold text-[#111827] flex-1 text-center pr-9">Nova despesa</span>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-6 space-y-5">
        {/* Descrição */}
        <div>
          <label className="block text-[14px] font-medium text-[#111827] mb-2">Descrição</label>
          <div className="border border-gray-300 rounded-[4px] px-3 py-3 bg-white">
            <span className="text-[15px] text-[#111827]">Restaurante beira-mar</span>
          </div>
        </div>

        {/* Valor total */}
        <div>
          <label className="block text-[14px] font-medium text-[#111827] mb-2">Valor total (R$)</label>
          <div className="border border-gray-300 rounded-[4px] px-3 py-3 bg-white">
            <span className="text-[15px] text-[#111827]">185,00</span>
          </div>
        </div>

        {/* Quem pagou */}
        <div>
          <label className="block text-[14px] font-medium text-[#111827] mb-3">Quem pagou?</label>
          <div className="flex gap-3">
            {MEMBERS.map((m) => {
              const selected = m.name === PAYER;
              return (
                <button key={m.name} className="flex flex-col items-center gap-1.5">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[16px] font-bold relative"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                    {selected && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#5B3FA8] border-2 border-white flex items-center justify-center">
                        <Check size={10} color="white" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: selected ? "#5B3FA8" : "#5F6B7A" }}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quem participou */}
        <div>
          <label className="block text-[14px] font-medium text-[#111827] mb-3">Quem participou?</label>
          <div className="space-y-0">
            {MEMBERS.map((m, i) => {
              const checked = PARTICIPANTS_CHECKED.includes(m.name);
              return (
                <div
                  key={m.name}
                  className={`flex items-center gap-3 py-3 ${i < MEMBERS.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <div
                    className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0`}
                    style={{ backgroundColor: checked ? "#5B3FA8" : "white", border: checked ? "none" : "2px solid #D1D5DB" }}
                  >
                    {checked && <Check size={12} color="white" strokeWidth={3} />}
                  </div>
                  <span className="text-[15px] text-[#111827]">{m.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-6 pt-3 bg-white border-t border-gray-100">
        <button className="w-full bg-[#5B3FA8] text-white text-[16px] font-bold py-4 rounded-xl">
          Salvar despesa
        </button>
      </div>
    </div>
  );
}
