import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Ship,
  PackageCheck,
  Tags,
  Microscope,
  Sprout,
  FileCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "../../utils/cn";

export interface ServiceSegment {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  activeBg: string;
  activeTextColor: string;
  inactiveIconBg: string;
  inactiveIconColor: string;
  link: string;
}

const SERVICES: ServiceSegment[] = [
  {
    id: "bulk-supply",
    title: "Bulk Container Shipping",
    shortDesc: "Full sea container orders in 25kg or 50kg export bags with moisture protection.",
    fullDesc:
      "We pack full 20ft and 40ft sea containers at Paradip, Vizag, and Mumbai ports in strong 25kg/50kg bags with moisture barriers and lab test reports.",
    icon: Ship,
    activeBg: "bg-[#93bbfc]", // Soft Sky Blue
    activeTextColor: "text-slate-950",
    inactiveIconBg: "bg-sky-100",
    inactiveIconColor: "text-sky-600",
    link: "/services",
  },
  {
    id: "custom-packaging",
    title: "Custom Packaging Sizes",
    shortDesc: "Flexible packing from 5kg sealed pouches to large 1,000kg bulk bags.",
    fullDesc:
      "We pack your spices to match your exact business requirements, with custom weight bags, multilingual labels, barcodes, and wooden pallet loading.",
    icon: PackageCheck,
    activeBg: "bg-[#fca5a5]", // Soft Coral / Rose
    activeTextColor: "text-slate-950",
    inactiveIconBg: "bg-rose-100",
    inactiveIconColor: "text-rose-500",
    link: "/services",
  },
  {
    id: "private-label",
    title: "Private Label & Grinding",
    shortDesc: "Custom grinding from coarse flakes to fine powders, packed under your brand.",
    fullDesc:
      "We grind spices to your requested texture—from crushed flakes to fine powders—and package them in retail-ready pouches with your brand logos.",
    icon: Tags,
    activeBg: "bg-[#86efac]", // Soft Mint / Emerald
    activeTextColor: "text-slate-950",
    inactiveIconBg: "bg-emerald-100",
    inactiveIconColor: "text-emerald-600",
    link: "/services",
  },
  {
    id: "quality-assays",
    title: "Certified Lab Testing",
    shortDesc: "Every batch is tested in certified labs for moisture, natural oils, and food safety.",
    fullDesc:
      "Every shipment comes with official test reports from international labs (like SGS or Eurofins) checking moisture, natural oils, and food safety.",
    icon: Microscope,
    activeBg: "bg-[#fde047]", // Soft Sunflower / Amber
    activeTextColor: "text-slate-950",
    inactiveIconBg: "bg-amber-100",
    inactiveIconColor: "text-amber-600",
    link: "/services",
  },
  {
    id: "farmer-network",
    title: "Direct Farmer Sourcing",
    shortDesc: "Buying freshly harvested spices directly from tribal farmer groups in Odisha.",
    fullDesc:
      "We partner directly with family and tribal farmers in the highlands of Odisha. Sourcing at harvest time gives you fresh crops at fair, transparent prices.",
    icon: Sprout,
    activeBg: "bg-[#d8b4fe]", // Soft Lavender / Purple
    activeTextColor: "text-slate-950",
    inactiveIconBg: "bg-purple-100",
    inactiveIconColor: "text-purple-600",
    link: "/about",
  },
  {
    id: "export-docs",
    title: "Complete Export Papers",
    shortDesc: "We take care of all government export approvals, plant health certificates, and customs papers.",
    fullDesc:
      "We prepare all official shipping documents: Spices Board clearance, Plant Health (Phytosanitary) certificate, Certificate of Origin, and ocean Bills of Lading.",
    icon: FileCheck,
    activeBg: "bg-[#7dd3fc]", // Soft Cyan / Azure
    activeTextColor: "text-slate-950",
    inactiveIconBg: "bg-cyan-100",
    inactiveIconColor: "text-cyan-600",
    link: "/export-process",
  },
];

export const CommercialServicesSegmented: React.FC<{ className?: string }> = ({
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={cn("w-full", className)}>
      {/* ── Desktop & Tablet Segmented Horizontal Container (slightly increased height) ── */}
      <div className="hidden md:block w-full bg-white rounded-3xl p-3 sm:p-3.5 shadow-xl border border-sky-100 overflow-hidden">
        <div className="grid grid-cols-6 divide-x divide-slate-100">
          {SERVICES.map((item, idx) => {
            const isActive = activeIndex === idx;
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative flex flex-col justify-between p-5 lg:p-6 transition-all duration-300 cursor-pointer select-none min-h-[360px] lg:min-h-[385px]",
                  isActive
                    ? cn(item.activeBg, item.activeTextColor, "rounded-2xl shadow-md z-10 scale-[1.01]")
                    : "bg-transparent text-slate-800 hover:bg-slate-50/70"
                )}
              >
                <div>
                  {/* Circular Icon Badge */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive
                        ? "bg-white text-slate-950 shadow-sm"
                        : cn(item.inactiveIconBg, item.inactiveIconColor)
                    )}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Project-Specific Title */}
                  <h3
                    className={cn(
                      "font-sans font-bold text-sm lg:text-base leading-snug mt-4 mb-2.5 transition-colors",
                      isActive ? "text-slate-950 font-extrabold" : "text-slate-900"
                    )}
                  >
                    {item.title}
                  </h3>

                  {/* Project-Specific Description Lines */}
                  <p
                    className={cn(
                      "text-xs leading-relaxed transition-colors",
                      isActive
                        ? "text-slate-900 font-medium"
                        : "text-slate-500 line-clamp-5"
                    )}
                  >
                    {isActive ? item.fullDesc : item.shortDesc}
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 mt-auto">
                  {isActive ? (
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-950 hover:underline"
                    >
                      <span>LEARN MORE</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-600 transition-colors">
                      View details &rarr;
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile Horizontal Swipe / Accordion Container ── */}
      <div className="md:hidden flex flex-col gap-2.5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
          {SERVICES.map((item, idx) => {
            const isActive = activeIndex === idx;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "shrink-0 snap-start px-3.5 py-2 rounded-full border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
                  isActive
                    ? cn(item.activeBg, "text-slate-950 border-transparent shadow-sm")
                    : "bg-white text-slate-700 border-sky-100 shadow-2xs"
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Active Expanded Card */}
        {(() => {
          const current = SERVICES[activeIndex];
          const IconComponent = current.icon;

          return (
            <div
              className={cn(
                "p-5 rounded-2xl shadow-lg border border-sky-100 flex flex-col justify-between transition-all duration-300 min-h-[220px]",
                current.activeBg,
                current.activeTextColor
              )}
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-950 mb-3">
                  <IconComponent className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-sans font-bold text-lg text-slate-950 mb-2">
                  {current.title}
                </h3>
                <p className="text-sm text-slate-900 leading-relaxed font-medium mb-4">
                  {current.fullDesc}
                </p>
              </div>

              <Link
                to={current.link}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-slate-950 hover:underline pt-2"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
