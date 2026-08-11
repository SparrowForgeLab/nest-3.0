import React from 'react';

export default function BuyMeACoffeeCoin() {
  return (
    <a
      href="https://buymeacoffee.com/sparrowforgelab"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-16 h-16 transition-all duration-300 hover:scale-110 hover:rotate-6 drop-shadow-2xl cursor-pointer group hidden sm:block"
      title="Buy Me A NEURON (Support Nest 3.0)"
    >
      {/* Spinning Curved SVG Text */}
      <svg
        className="absolute -top-5 -left-5 w-26 h-26 fill-amber-400 font-bold tracking-widest text-[9.5px] uppercase pointer-events-none animate-[spin_12s_linear_infinite] opacity-70 group-hover:opacity-100 group-hover:[animation-play-state:paused] transition-opacity"
        viewBox="0 0 100 100"
      >
        <path
          id="textPathCoin"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text>
          <textPath href="#textPathCoin" startOffset="50%" textAnchor="middle">
            &nbsp;&nbsp;&nbsp;&nbsp; BUY ME A NEURON &nbsp;&nbsp;&nbsp;&nbsp; BUY ME A NEURON
          </textPath>
        </text>
      </svg>

      {/* Sparrow Coin Image */}
      <img
        src="/sparrowcoin.png"
        alt="Buy Me A NEURON"
        className="w-full h-full object-contain relative z-10 drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] transition-all duration-300"
      />
    </a>
  );
}
