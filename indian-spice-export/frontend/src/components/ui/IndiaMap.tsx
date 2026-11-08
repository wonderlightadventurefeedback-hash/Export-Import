import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { MapPin, Anchor, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";

interface SourcingNode {
  id: string;
  name: string;
  state: string;
  belt: string;
  spices: string[];
  specs: string;
  isHomeBase?: boolean;
}

const NODES: SourcingNode[] = [
  {
    id: "odisha",
    name: "Odisha (Our Main Office & Growing Belt)",
    state: "Odisha",
    belt: "Kandhamal, Koraput & Coastal Belt",
    spices: ["Kandhamal Golden Turmeric", "Organic Fresh Ginger", "Wild Black Pepper"],
    specs: "Grown in high hills with rich red soil by local tribal farmer groups. Known for pure golden color and high natural oil.",
    isHomeBase: true,
  },
  {
    id: "kerala",
    name: "Kerala (Southern Spice Coast)",
    state: "Kerala",
    belt: "Wayanad & Idukki Hill Country",
    spices: ["Tellicherry Black Pepper", "Bold Green Cardamom", "Aromatic Cloves"],
    specs: "India's famous spice coast. Naturally sun-dried whole black peppercorns and large green cardamom pods with rich fragrance.",
    isHomeBase: false,
  },
  {
    id: "andhra",
    name: "Andhra Pradesh (Guntur Chilli Belt)",
    state: "Andhra Pradesh",
    belt: "Guntur & Krishna Markets",
    spices: ["Guntur S4 Red Chilli", "Teja Hot Chilli", "Byadgi Mild Red Chilli"],
    specs: "Asia's largest red chilli market. Deep red color and strong heat, available whole with or without stem, or crushed into flakes.",
    isHomeBase: false,
  },
  {
    id: "gujarat",
    name: "Gujarat (Unjha Seed Market)",
    state: "Gujarat",
    belt: "Unjha & Mehsana Belt",
    spices: ["Cleaned Cumin Seeds (Jeera)", "Green Fennel Seeds (Saunf)", "Natural White Sesame"],
    specs: "World's leading market for spice seeds. Cleaned with modern optical machines to achieve 99.5% clean export purity.",
    isHomeBase: false,
  },
  {
    id: "rajasthan",
    name: "Rajasthan (Coriander Belt)",
    state: "Rajasthan",
    belt: "Ramganj Mandi & Kota",
    spices: ["Golden Coriander Seeds (Dhania)", "Fenugreek Seeds (Methi)"],
    specs: "Famous for fragrant coriander seeds with a fresh citrus aroma, uniform round shape, and bright natural color.",
    isHomeBase: false,
  },
];

export const IndiaMap: React.FC<{ className?: string }> = ({ className }) => {
  const [activeNode, setActiveNode] = useState<SourcingNode>(NODES[0]);

  return (
    <div
      className={cn(
        "w-full rounded-md bg-white/95 backdrop-blur-md text-slate-800 border-2 border-sky-200/90 shadow-[0_20px_50px_rgba(2,132,199,0.18)] p-4 sm:p-6 flex flex-col lg:flex-row items-center gap-6 lg:gap-8",
        className
      )}
    >
      {/* ── LEFT COLUMN: Actual Map of India (User's Exact Map Image) ── */}
      <div className="relative w-full max-w-[320px] sm:max-w-[360px] shrink-0 flex flex-col items-center select-none bg-gradient-to-b from-sky-50 to-white p-3 rounded-md shadow-md border border-sky-100">
        <div className="relative w-full overflow-hidden rounded-sm flex items-center justify-center bg-white border border-sky-100">
          <img
            src="/india-map.png"
            alt="Actual map of India highlighting regional spice sourcing states"
            className="w-full h-auto object-contain max-h-[380px] sm:max-h-[410px] mx-auto transition-transform duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="mt-2.5 px-3 py-1 rounded-full bg-sky-100 text-[10px] text-sky-900 font-bold uppercase tracking-wider text-center flex items-center gap-1.5 border border-sky-200 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Odisha &amp; Pan-India Sourcing Corridors</span>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Compact Sourcing Information in White & Light Blue ── */}
      <div className="flex-1 w-full flex flex-col justify-between self-stretch gap-4 min-w-0">
        {/* Active State Card */}
        <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50/70 border border-sky-200 rounded-md p-4 sm:p-5 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="px-2 py-0.5 rounded-[2px] bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase tracking-wider">
                {activeNode.isHomeBase ? "Company Headquarters & Primary GI Belt" : "Verified Procurement Hub"}
              </span>
            </div>
            <span className="text-[10px] text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-[2px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Verified Sourcing
            </span>
          </div>

          <h3 className="font-sans text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{activeNode.name}</span>
          </h3>

          <p className="text-xs text-sky-900 mt-1 font-semibold">
            Agricultural Belt: <span className="text-slate-900 font-bold">{activeNode.belt}</span>
          </p>

          <p className="text-xs text-slate-600 mt-2 leading-relaxed font-normal">
            {activeNode.specs}
          </p>

          {/* Key Spices Tags */}
          <div className="mt-3 pt-3 border-t border-sky-100">
            <div className="text-[10px] uppercase tracking-wider text-amber-700 font-bold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Key Export Commodities</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeNode.spices.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white text-sky-950 border border-sky-200 rounded-[3px] shadow-2xs hover:border-sky-400 hover:bg-sky-50 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* State Selector Buttons */}
        <div>
          <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block mb-1.5">
            Select State Sourcing Corridor:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {NODES.map((node) => {
              const isSelected = activeNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-[3px] border text-left flex items-center justify-between transition-all cursor-pointer",
                    isSelected
                      ? "bg-sky-600 text-white border-sky-600 font-bold shadow-sm ring-2 ring-sky-300"
                      : "bg-white text-slate-700 border-sky-200 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-900 font-medium shadow-2xs"
                  )}
                >
                  <span className="truncate">{node.state}</span>
                  {isSelected && <ChevronRight className="w-3 h-3 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Port Connectivity Footer */}
        <div className="flex items-center gap-2.5 pt-2.5 text-[11px] text-slate-600 border-t border-sky-100">
          <Anchor className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong className="text-slate-900 font-bold">Export Seaports:</strong> Paradip &amp; Dhamra (Odisha), Visakhapatnam, JNPT Mumbai, Cochin Port
          </span>
        </div>
      </div>
    </div>
  );
};
