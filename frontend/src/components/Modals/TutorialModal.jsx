import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles, Command, Move, Layout, Sliders, Coffee, CheckCircle2 } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Nest 3.0',
    icon: Sparkles,
    color: 'from-sky-500 to-indigo-500',
    description: 'Your state-of-the-art, hyper-customizable personal startpage and dashboard.',
    bullets: [
      'Organize all your bookmarks, links, and quick tools in one sleek interface.',
      'Enjoy glassmorphic aesthetic themes, dynamic wallpapers, and responsive grids.',
      'Everything is saved locally and synced in real-time to your server database.'
    ]
  },
  {
    id: 'cmd_palette',
    title: 'Command Palette (Ctrl + K)',
    icon: Command,
    color: 'from-purple-500 to-pink-500',
    description: 'Lightning-fast keyboard navigation across your entire dashboard.',
    bullets: [
      'Press Ctrl+K (or Cmd+K) anywhere on the page to open instant search.',
      'Jump to any category, launch bookmarks, or toggle preferences instantly.',
      'Filter links by typing search keywords without reaching for your mouse.'
    ]
  },
  {
    id: 'drag_drop',
    title: 'Drag & Drop Dashboard Engine',
    icon: Move,
    color: 'from-amber-500 to-orange-500',
    description: 'Total freedom to arrange your bookmark cards and category panels.',
    bullets: [
      'Click and drag category headers to reorder whole column panels.',
      'Drag bookmark cards to rearrange within a category or move across columns.',
      'All layout changes save automatically and persist across browser sessions.'
    ]
  },
  {
    id: 'widgets',
    title: 'Widgets & Collapsible Sidebars',
    icon: Layout,
    color: 'from-emerald-500 to-teal-500',
    description: 'Analog Glass Clock, Multi-Day Weather, To-Do List & RSS Reader.',
    bullets: [
      'Choose between Digital or SVG Analog Glass Clock in 12h/24h formats.',
      'Search Weather by City, ZIP, or Lat/Lon with customizable 3 to 10 day forecasts.',
      'Move RSS Reader & To-Do lists into slide-out collapsible sidebars.'
    ]
  },
  {
    id: 'customization',
    title: 'Personalization & Private Vault',
    icon: Sliders,
    color: 'from-rose-500 to-indigo-500',
    description: 'Tailor themes, custom background uploads, and password-protected Vault.',
    bullets: [
      'Choose from curated HD wallpapers or upload your own background image.',
      'Unlock or create password-protected Private Vault categories for sensitive links.',
      'You can re-open this tutorial anytime by clicking the Help (❓) icon!'
    ]
  }
];

export default function TutorialModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const StepIcon = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;

  const handleFinish = () => {
    localStorage.setItem('nest3_has_seen_tutorial', 'true');
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 glass-panel shadow-2xl text-slate-100 flex flex-col justify-between space-y-6 relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className={`absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br ${step.color} rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-500`} />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </span>
          </div>

          <button onClick={handleFinish} className="text-slate-400 hover:text-slate-200 text-xs font-semibold transition flex items-center gap-1">
            Skip Tutorial <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Step Visual & Details */}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}>
              <StepIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">{step.title}</h3>
              <p className="text-xs text-sky-300 font-medium">{step.description}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            {step.bullets.map((b, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots & Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 relative z-10">
          {/* Progress Indicators */}
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === idx ? 'w-6 bg-sky-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}

            {!isLastStep ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition flex items-center gap-1 shadow-lg"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition shadow-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Get Started!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
