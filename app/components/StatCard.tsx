import React from "react";

interface StatCardProps {
  type?: "materi" | "matakuliah";
  icon?: React.ReactNode;
  label: string;
  value: number;
}

export default function StatCard({ type, icon, label, value }: StatCardProps) {
  return (
    <div className="bg-white border border-[#DCE4F0] p-6 rounded-2xl shadow-xs flex items-center gap-5 md:gap-6">
      {type === "materi" ? (
        <div className="w-[74px] h-[64px] rounded-xl bg-[#FFCC00] flex items-center justify-center p-2 shrink-0 shadow-xs relative">
          <svg className="w-full h-full text-white" viewBox="0 0 44 36" fill="none">
            {/* Handle atas */}
            <path d="M16 4h12a2 2 0 0 1 2 2v2H14V6a2 2 0 0 1 2-2z" fill="#E6B800" />
            {/* Tas / Folder */}
            <rect x="2" y="8" width="40" height="26" rx="4" fill="#FFD700" stroke="#E6B800" strokeWidth="1.5" />
            {/* Garis 1 */}
            <circle cx="8" cy="15" r="1.5" fill="white" />
            <line x1="12" y1="15" x2="26" y2="15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            {/* Garis 2 */}
            <circle cx="8" cy="21" r="1.5" fill="white" />
            <line x1="12" y1="21" x2="24" y2="21" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            {/* Garis 3 */}
            <circle cx="8" cy="27" r="1.5" fill="white" />
            <line x1="12" y1="27" x2="28" y2="27" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            {/* Tag ornamen kanan */}
            <circle cx="34" cy="18" r="2.5" fill="#FFE866" />
            <path d="M34 20.5v3" stroke="#FFE866" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      ) : type === "matakuliah" ? (
        <div className="w-[74px] h-[64px] rounded-xl bg-[#52C463] flex items-center justify-center p-2 shrink-0 shadow-xs relative">
          <svg className="w-full h-full" viewBox="0 0 44 36" fill="none">
            {/* Dokumen belakang */}
            <rect x="8" y="4" width="18" height="26" rx="3" fill="#D4F3DA" />
            <line x1="12" y1="9" x2="20" y2="9" stroke="#52C463" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="12" y1="14" x2="22" y2="14" stroke="#52C463" strokeWidth="1.8" strokeLinecap="round" />
            {/* Dokumen depan */}
            <rect x="18" y="8" width="20" height="24" rx="3" fill="white" stroke="#E2E8F0" strokeWidth="1" />
            <line x1="22" y1="13" x2="33" y2="13" stroke="#52C463" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="18" x2="34" y2="18" stroke="#52C463" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="23" x2="29" y2="23" stroke="#52C463" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      ) : (
        icon && <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
      )}

      <div>
        <h3 className="text-xl md:text-2xl font-bold text-[#2D3748] tracking-tight">{label}</h3>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-xl font-bold text-[#2D3748]">{value}</span>
          <div className="w-28 md:w-36 h-[3px] bg-[#5469D4] rounded-full" />
        </div>
      </div>
    </div>
  );
}