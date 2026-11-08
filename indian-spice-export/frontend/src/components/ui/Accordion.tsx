import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

export interface AccordionItemProps {
  id: string;
  title: string;
  content: React.ReactNode;
  isOpenDefault?: boolean;
}

export interface AccordionProps {
  items: AccordionItemProps[];
  className?: string;
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  allowMultiple = false,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(() =>
    items.filter((item) => item.isOpenDefault).map((item) => item.id)
  );

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("divide-y divide-ivory-300 border-y border-ivory-300", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div key={item.id} className="py-4">
            <h3>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                aria-controls={`accordion-section-${item.id}`}
                id={`accordion-button-${item.id}`}
                className="w-full flex items-center justify-between text-left py-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-[2px]"
              >
                <span className="font-serif text-lg sm:text-xl text-forest-900 group-hover:text-forest-700 transition-colors font-normal">
                  {item.title}
                </span>
                <span
                  className={cn(
                    "ml-4 shrink-0 w-7 h-7 rounded-full border border-ivory-400 flex items-center justify-center text-charcoal-light transition-all duration-300 group-hover:border-gold-500 group-hover:text-gold-600",
                    isOpen && "rotate-180 bg-forest-800 text-ivory-100 border-forest-800"
                  )}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
            </h3>

            <div
              id={`accordion-section-${item.id}`}
              role="region"
              aria-labelledby={`accordion-button-${item.id}`}
              className={cn(
                "overflow-hidden transition-all duration-300 ease-out",
                isOpen ? "max-h-96 opacity-100 pt-2 pb-3" : "max-h-0 opacity-0"
              )}
            >
              <div className="text-sm sm:text-base text-charcoal-light leading-relaxed pr-6">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
