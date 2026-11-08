import React, { useState, useEffect } from "react";
import { Palette, RotateCcw, Save, Sparkles, Check, Sliders } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import { useAdminAuth } from "../../context/AdminAuthContext";

export const AdminThemeDesign: React.FC = () => {
  const { canEditContent } = useAdminAuth();
  const [theme, setTheme] = useState<any>({
    brandForest: "#0d2b1d",
    brandGold: "#dfb15b",
    brandCream: "#fdfbf7",
    fontHeading: "Cinzel, serif",
    fontBody: "Outfit, sans-serif",
    borderRadius: "rounded-md",
    animationPreset: "Standard",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(true);

  const fetchTheme = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.getTheme();
      if (data) setTheme(data);
    } catch (err) {
      console.error("Failed to load theme:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const handleChange = (field: string, value: string) => {
    setTheme((prev: any) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = async () => {
    try {
      await adminApi.updateTheme(theme);
      setIsSaved(true);
      alert("Theme design tokens saved!");
    } catch (err: any) {
      alert(err.message || "Failed to update theme.");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset brand tokens to factory defaults?")) return;
    try {
      const data = await adminApi.resetTheme();
      setTheme(data);
      setIsSaved(true);
    } catch (err: any) {
      alert(err.message || "Failed to reset theme.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#0d2b1d] dark:text-white">
            Brand Theme & Design Tokens
          </h1>
          <p className="text-xs text-[#5c7365] dark:text-[#90a89a]">
            Customise botanical color swatches, typography pairings, and micro-interaction animations.
          </p>
        </div>

        {canEditContent && (
          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleReset}
              className="px-3 py-2 text-xs border border-[#d5ded7] dark:border-[#274030] rounded-lg hover:bg-gray-100 dark:hover:bg-[#18291f] flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold bg-[#dfb15b] text-[#0d2b1d] rounded-lg hover:bg-[#ebd28b] flex items-center space-x-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? "Saved" : "Save Brand Tokens"}</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Token Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Colors Card */}
          <div className="p-5 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-[#0d2b1d] dark:text-white flex items-center space-x-2">
              <Palette className="w-4 h-4 text-[#dfb15b]" />
              <span>Core Brand Palette Tokens</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Forest Green */}
              <div className="p-3 border border-[#d5ded7] dark:border-[#274030] rounded-lg space-y-2">
                <label className="block font-semibold">Primary Forest</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={theme.brandForest}
                    onChange={(e) => handleChange("brandForest", e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.brandForest}
                    onChange={(e) => handleChange("brandForest", e.target.value)}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Accent Gold */}
              <div className="p-3 border border-[#d5ded7] dark:border-[#274030] rounded-lg space-y-2">
                <label className="block font-semibold">Accent Gold</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={theme.brandGold}
                    onChange={(e) => handleChange("brandGold", e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.brandGold}
                    onChange={(e) => handleChange("brandGold", e.target.value)}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Warm Ivory */}
              <div className="p-3 border border-[#d5ded7] dark:border-[#274030] rounded-lg space-y-2">
                <label className="block font-semibold">Warm Ivory Cream</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={theme.brandCream}
                    onChange={(e) => handleChange("brandCream", e.target.value)}
                    className="w-8 h-8 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.brandCream}
                    onChange={(e) => handleChange("brandCream", e.target.value)}
                    className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-1.5 font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typography & Geometry */}
          <div className="p-5 bg-white dark:bg-[#15231b] rounded-xl border border-[#d5ded7] dark:border-[#274030] shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-[#0d2b1d] dark:text-white">Typography & Geometry</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Headline Font Family</label>
                <select
                  value={theme.fontHeading}
                  onChange={(e) => handleChange("fontHeading", e.target.value)}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                >
                  <option value="Cinzel, serif">Cinzel (Regal Classical Serif)</option>
                  <option value="'Playfair Display', serif">Playfair Display (Editorial Serif)</option>
                  <option value="Outfit, sans-serif">Outfit (Modern Clean Sans)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Body Font Family</label>
                <select
                  value={theme.fontBody}
                  onChange={(e) => handleChange("fontBody", e.target.value)}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                >
                  <option value="Outfit, sans-serif">Outfit (Clean Sans)</option>
                  <option value="Inter, sans-serif">Inter (Dense Technical)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block font-medium mb-1">Border Radius Style</label>
                <select
                  value={theme.borderRadius}
                  onChange={(e) => handleChange("borderRadius", e.target.value)}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                >
                  <option value="rounded-none">Sharp 90-degree Corners (rounded-none)</option>
                  <option value="rounded-sm">Subtle Chamfer (rounded-sm)</option>
                  <option value="rounded-md">Standard Architectural (rounded-md)</option>
                  <option value="rounded-xl">Curved Luxury (rounded-xl)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Motion & Animation Preset</label>
                <select
                  value={theme.animationPreset}
                  onChange={(e) => handleChange("animationPreset", e.target.value)}
                  className="w-full bg-[#f8faf8] dark:bg-[#16271d] border border-[#d5ded7] dark:border-[#274030] rounded p-2"
                >
                  <option value="Standard">Standard Smooth (Scroll reveals + Ken Burns)</option>
                  <option value="Cinematic">Cinematic (Slow magnetic float + parallax)</option>
                  <option value="Reduced">Reduced Motion (Accessible instant transitions)</option>
                  <option value="Off">Completely Off (Static high-speed performance)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Live Token Preview Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#788f82]">
            Component Token Preview
          </div>

          <div
            className="p-6 rounded-2xl shadow-lg border space-y-4"
            style={{
              backgroundColor: theme.brandCream,
              borderColor: "#d5ded7",
            }}
          >
            <div
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: theme.brandGold }}
            >
              GI-Tagged Sourcing Corridor
            </div>

            <h3
              className="text-lg font-bold"
              style={{
                fontFamily: theme.fontHeading,
                color: theme.brandForest,
              }}
            >
              Kandhamal Organic Turmeric Fingers
            </h3>

            <p className="text-xs text-gray-700 leading-relaxed" style={{ fontFamily: theme.fontBody }}>
              Hand-harvested in the pristine highlands of Kandhamal, Odisha, free from synthetic pesticides and artificial polish. Curcumin certified at 5.2%.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold rounded shadow-sm text-white"
                style={{ backgroundColor: theme.brandForest }}
              >
                Inquire Container Load
              </button>
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded border"
                style={{ borderColor: theme.brandForest, color: theme.brandForest }}
              >
                View Specifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
