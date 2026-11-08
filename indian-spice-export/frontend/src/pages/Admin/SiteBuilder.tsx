import React, { useState, useEffect } from "react";
import {
  FileCheck,
  Plus,
  Eye,
  EyeOff,
  GripVertical,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  RotateCcw,
  Sparkles,
  Layers,
  Edit3,
  Trash2,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

interface SectionBlock {
  id: string;
  section: string;
  title: string;
  type: string;
  isVisible: boolean;
  content: Record<string, any>;
}

// Sortable Block Item Component
const SortableBlock: React.FC<{
  block: SectionBlock;
  onToggleVisibility: (id: string) => void;
  onEdit: (block: SectionBlock) => void;
  onDelete: (id: string) => void;
}> = ({ block, onToggleVisibility, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
        block.isVisible
          ? "bg-white dark:bg-[#15231b] border-[#d5ded7] dark:border-[#274030] shadow-xs"
          : "bg-gray-50 dark:bg-[#101b14] border-dashed border-gray-300 dark:border-gray-800 opacity-60"
      }`}
    >
      <div className="flex items-center space-x-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xs text-[#0d2b1d] dark:text-white">
              {block.title}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-[#f0f4f1] dark:bg-[#1e3427] text-[#0d2b1d] dark:text-[#dfb15b]">
              {block.type}
            </span>
          </div>
          <div className="text-[11px] text-[#788f82] dark:text-[#7f998a]">
            Section key: <code className="font-mono">{block.section}</code>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onToggleVisibility(block.id)}
          className={`p-1.5 rounded text-xs transition-colors ${
            block.isVisible ? "text-emerald-600 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"
          }`}
          title={block.isVisible ? "Hide section on live site" : "Show section"}
        >
          {block.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onEdit(block)}
          className="p-1.5 rounded text-xs text-blue-600 hover:bg-blue-50"
          title="Edit block content"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        <button
          onClick={() => onDelete(block.id)}
          className="p-1.5 rounded text-xs text-red-600 hover:bg-red-50"
          title="Remove block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AdminSiteBuilder: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [activePage, setActivePage] = useState<string>("home");
  const [devicePreview, setDevicePreview] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isSaved, setIsSaved] = useState(true);
  const [editingBlock, setEditingBlock] = useState<SectionBlock | null>(null);

  const [blocks, setBlocks] = useState<Record<string, SectionBlock[]>>({
    home: [
      {
        id: "b-1",
        section: "hero",
        title: "Hero Banner & Value Proposition",
        type: "Hero Banner",
        isVisible: true,
        content: {
          headline: "India's Direct Spice Export Corridor",
          subheadline: "Single-origin commodities sourced from verified farming cooperatives in Kandhamal, Guntur, and Malabar.",
          primaryCta: "Request Commercial Quote",
        },
      },
      {
        id: "b-2",
        section: "trust-strip",
        title: "Statutory Trust Strip & Credentials",
        type: "Stats Bar",
        isVisible: true,
        content: {
          apedaBadge: "APEDA Registered",
          spicesBoard: "Spices Board Certified",
          labPartnership: "SGS Tested",
        },
      },
      {
        id: "b-3",
        section: "featured-spices",
        title: "Featured Commodities Carousel",
        type: "Product Grid",
        isVisible: true,
        content: { limit: 4, showGrades: true },
      },
      {
        id: "b-4",
        section: "services-band",
        title: "Direct Sourcing & Processing Flow",
        type: "Services Steps",
        isVisible: true,
        content: { stepCount: 4 },
      },
      {
        id: "b-gallery",
        section: "business-gallery",
        title: "Home Business & Facility Gallery",
        type: "Image Gallery",
        isVisible: localStorage.getItem("site_gallery_visible") !== "false",
        content: {
          headline: "Business & Facility Operations Gallery",
          itemCount: 6,
        },
      },
      {
        id: "b-5",
        section: "cta-strip",
        title: "Trade Desk Immediate Contact CTA",
        type: "CTA Band",
        isVisible: true,
        content: {
          headline: "Procure Container Lots Direct From Source",
          actionText: "Connect With Export Desk",
        },
      },
    ],
    about: [
      {
        id: "b-ab-1",
        section: "about-hero",
        title: "About Us Mission & Heritage",
        type: "Hero Banner",
        isVisible: true,
        content: {
          headline: "Grown in Indian Soil, Delivered Across Seven Seas",
        },
      },
    ],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const currentBlocks = blocks[activePage] || [];

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setBlocks((prev) => {
        const list = prev[activePage];
        const oldIndex = list.findIndex((i) => i.id === active.id);
        const newIndex = list.findIndex((i) => i.id === over.id);
        return {
          ...prev,
          [activePage]: arrayMove(list, oldIndex, newIndex),
        };
      });
      setIsSaved(false);
    }
  };

  const handleToggleVisibility = (id: string) => {
    setBlocks((prev) => {
      const updatedList = prev[activePage].map((b) => {
        if (b.id === id) {
          const nextState = !b.isVisible;
          if (b.section === "business-gallery") {
            localStorage.setItem("site_gallery_visible", String(nextState));
            window.dispatchEvent(new Event("gallery-visibility-change"));
          }
          return { ...b, isVisible: nextState };
        }
        return b;
      });
      return {
        ...prev,
        [activePage]: updatedList,
      };
    });
    setIsSaved(false);
  };

  const handleDeleteBlock = (id: string) => {
    if (!window.confirm("Remove this section block?")) return;
    setBlocks((prev) => ({
      ...prev,
      [activePage]: prev[activePage].filter((b) => b.id !== id),
    }));
    setIsSaved(false);
  };

  const handlePublishLive = async () => {
    try {
      // Save all blocks to backend content service
      for (const blk of currentBlocks) {
        await adminApi.saveContentBlock({
          page: activePage,
          section: blk.section,
          type: blk.type,
          content: blk.content,
          status: blk.isVisible ? "published" : "draft",
        });
      }
      setIsSaved(true);
      alert(`Page "${activePage}" published live successfully.`);
    } catch (err: any) {
      alert(err.message || "Failed to publish page.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Page Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Visual Site Builder & Sections
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Reorder page sections, show/hide blocks, edit rich copy, and preview changes across devices.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Responsive Preview Toggles */}
          <div className="flex items-center bg-[#f0f4f1] dark:bg-[#1a2b21] p-1 rounded-lg border border-[#d5ded7] dark:border-[#274030]">
            <button
              onClick={() => setDevicePreview("desktop")}
              className={`p-1.5 rounded ${
                devicePreview === "desktop"
                  ? "bg-white dark:bg-[#0d2b1d] text-[#0d2b1d] dark:text-[#dfb15b] shadow-xs"
                  : "text-[#788f82]"
              }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevicePreview("tablet")}
              className={`p-1.5 rounded ${
                devicePreview === "tablet"
                  ? "bg-white dark:bg-[#0d2b1d] text-[#0d2b1d] dark:text-[#dfb15b] shadow-xs"
                  : "text-[#788f82]"
              }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevicePreview("mobile")}
              className={`p-1.5 rounded ${
                devicePreview === "mobile"
                  ? "bg-white dark:bg-[#0d2b1d] text-[#0d2b1d] dark:text-[#dfb15b] shadow-xs"
                  : "text-[#788f82]"
              }`}
              title="Mobile phone view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {canEditContent && (
            <button
              onClick={handlePublishLive}
              className="px-4 py-2 text-xs font-bold bg-[#dfb15b] text-[#0d2b1d] rounded-lg hover:bg-[#ebd28b] flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? "Published Live" : "Publish Live Changes"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex space-x-2 border-b border-[#e2e8e3] dark:border-[#274030] text-xs">
        {["home", "about", "services", "export-process", "contact"].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`pb-2.5 px-3 font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activePage === page
                ? "border-[#dfb15b] text-[#0d2b1d] dark:text-[#dfb15b]"
                : "border-transparent text-[#788f82] hover:text-[#0d2b1d]"
            }`}
          >
            {page.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Main Workspace: Reorderable List & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Section Blocks Reorder List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0d2b1d] dark:text-white uppercase tracking-wider">
              Page Section Blocks
            </span>
            <button
              type="button"
              onClick={() => {
                const newId = `b-${Date.now()}`;
                const newBlock: SectionBlock = {
                  id: newId,
                  section: `custom-section-${currentBlocks.length + 1}`,
                  title: "Custom Highlight Block",
                  type: "Content Block",
                  isVisible: true,
                  content: { headline: "New Section Headline" },
                };
                setBlocks((prev) => ({
                  ...prev,
                  [activePage]: [...(prev[activePage] || []), newBlock],
                }));
                setIsSaved(false);
              }}
              className="text-xs font-bold text-[#dfb15b] hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={currentBlocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2.5">
                {currentBlocks.map((block) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onToggleVisibility={handleToggleVisibility}
                    onEdit={(b) => setEditingBlock(b)}
                    onDelete={handleDeleteBlock}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right: Live Responsive Preview Frame (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="text-xs text-[#788f82] mb-2 font-mono">
            Live Preview Frame ({devicePreview === "desktop" ? "100% Full Width" : devicePreview === "tablet" ? "768px" : "375px"})
          </div>

          <div
            className={`bg-white dark:bg-[#0b140f] border-4 border-[#1a3526] rounded-2xl shadow-xl overflow-hidden transition-all duration-300 min-h-[500px] w-full ${
              devicePreview === "tablet" ? "max-w-md" : devicePreview === "mobile" ? "max-w-xs" : "w-full"
            }`}
          >
            {/* Mock browser top bar */}
            <div className="bg-[#1a3526] text-white/70 px-4 py-2 flex items-center justify-between text-[11px] font-mono">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div>indianspiceexport.com/{activePage === "home" ? "" : activePage}</div>
              <div />
            </div>

            {/* Rendered Live Sections Preview */}
            <div className="p-4 space-y-4 max-h-[550px] overflow-y-auto">
              {currentBlocks
                .filter((b) => b.isVisible)
                .map((block) => (
                  <div
                    key={block.id}
                    className="p-4 rounded-xl bg-[#f9faf9] dark:bg-[#121f17] border border-[#e2e8e3] dark:border-[#203628]"
                  >
                    <div className="text-[10px] uppercase font-bold text-[#dfb15b] tracking-wider mb-1">
                      {block.type}
                    </div>
                    <div className="font-serif font-bold text-sm text-[#0d2b1d] dark:text-white">
                      {block.content?.headline || block.title}
                    </div>
                    {block.content?.subheadline && (
                      <p className="text-xs text-[#5c7365] dark:text-[#90a89a] mt-1">
                        {block.content.subheadline}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Block Content Drawer / Modal */}
      {editingBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#132219] rounded-2xl shadow-2xl border border-[#d5ded7] dark:border-[#274030] overflow-hidden">
            <div className="p-4 border-b border-[#e2e8e3] dark:border-[#203628] flex items-center justify-between bg-[#f8faf8] dark:bg-[#101b14]">
              <h3 className="text-sm font-bold text-[#0d2b1d] dark:text-white">
                Edit Section: {editingBlock.title}
              </h3>
              <button onClick={() => setEditingBlock(null)}>
                <Trash2 className="w-4 h-4 text-[#788f82]" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium mb-1">Section Display Title</label>
                <input
                  type="text"
                  value={editingBlock.title}
                  onChange={(e) => setEditingBlock({ ...editingBlock, title: e.target.value })}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Headline Content</label>
                <input
                  type="text"
                  value={editingBlock.content?.headline || ""}
                  onChange={(e) =>
                    setEditingBlock({
                      ...editingBlock,
                      content: { ...editingBlock.content, headline: e.target.value },
                    })
                  }
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Subheadline / Supporting Text</label>
                <textarea
                  rows={3}
                  value={editingBlock.content?.subheadline || ""}
                  onChange={(e) =>
                    setEditingBlock({
                      ...editingBlock,
                      content: { ...editingBlock.content, subheadline: e.target.value },
                    })
                  }
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8e3] dark:border-[#203628] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-4 py-2 border border-[#d5ded7] dark:border-[#274030] rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBlocks((prev) => ({
                      ...prev,
                      [activePage]: prev[activePage].map((b) =>
                        b.id === editingBlock.id ? editingBlock : b
                      ),
                    }));
                    setIsSaved(false);
                    setEditingBlock(null);
                  }}
                  className="px-5 py-2 bg-[#dfb15b] text-[#0d2b1d] font-bold rounded"
                >
                  Save Section Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
