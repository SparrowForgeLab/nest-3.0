import React, { useState } from 'react';
import { Palette, Plus, Check, RefreshCw } from 'lucide-react';

const DEFAULT_PRESETS = [
  '#38bdf8', // Sky Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#6366f1', // Indigo
  '#84cc16', // Lime
  '#06b6d4', // Cyan
  '#d946ef', // Fuchsia
  '#14b8a6', // Teal
  '#64748b'  // Slate
];

export default function ColorPicker({ selectedColor, onSelectColor, label = 'Accent Color' }) {
  const [customPresets, setCustomPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('nest3_custom_color_swatches');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [hexInput, setHexInput] = useState(selectedColor || '#38bdf8');

  const handleHexChange = (e) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      onSelectColor(val);
    }
  };

  const handleColorPick = (colorVal) => {
    setHexInput(colorVal);
    onSelectColor(colorVal);
  };

  const handleSaveCustomSwatch = () => {
    const validColor = selectedColor || hexInput;
    if (!validColor) return;
    if (!customPresets.includes(validColor)) {
      const updated = [validColor, ...customPresets].slice(0, 10);
      setCustomPresets(updated);
      try {
        localStorage.setItem('nest3_custom_color_swatches', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-2.5">
      <label className="block text-slate-300 font-semibold text-xs flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-sky-400" /> {label}
        </span>
        <span className="text-[11px] font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
          {selectedColor || hexInput}
        </span>
      </label>

      {/* Preset Color Swatches */}
      <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-950/80 rounded-xl border border-slate-800">
        {DEFAULT_PRESETS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleColorPick(c)}
            className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
              selectedColor === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-85 hover:opacity-100 hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
            title={c}
          >
            {selectedColor === c && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
          </button>
        ))}

        {/* Custom Presets Saved by User */}
        {customPresets.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handleColorPick(c)}
            className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ring-1 ring-sky-400/50 ${
              selectedColor === c ? 'scale-125 ring-2 ring-white shadow-lg' : 'opacity-85 hover:opacity-100 hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
            title={`Custom Swatch: ${c}`}
          >
            {selectedColor === c && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
          </button>
        ))}
      </div>

      {/* Custom Color Input Controls */}
      <div className="flex items-center gap-2 pt-1">
        {/* Color Wheel Input Box */}
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={selectedColor || '#38bdf8'}
            onChange={(e) => handleColorPick(e.target.value)}
            className="w-10 h-9 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer p-1"
            title="Open visual color picker wheel"
          />
        </div>

        {/* Hex Text Field */}
        <input
          type="text"
          placeholder="#38bdf8"
          value={hexInput}
          onChange={handleHexChange}
          className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono text-xs outline-none focus:border-sky-400 uppercase"
        />

        {/* Add Swatch Button */}
        <button
          type="button"
          onClick={handleSaveCustomSwatch}
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs transition border border-slate-700/60 flex items-center gap-1.5 whitespace-nowrap"
          title="Save custom color to your swatches palette"
        >
          <Plus className="w-3.5 h-3.5 text-sky-400" /> Save Swatch
        </button>
      </div>
    </div>
  );
}
