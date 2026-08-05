"use client";

import { useEffect, useRef, useState } from "react";

export function Hero() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center md:px-10"
    >
      <div
        className={`max-w-4xl transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
          <span className="mr-2 h-2 w-2 rounded-full bg-ayenda-amber" />
          <span className="text-xs font-medium uppercase tracking-widest text-white/70">
            The future is a journey
          </span>
        </div>

        <h1 className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl lg:text-8xl">
          Ayenda means <span className="text-ayenda-amber">Future.</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
          We are a creative technology studio that builds brands, products, and
          campaigns for the next era. Strategy, design, engineering, and media— unified
          under one vision.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-ayenda-amber to-ayenda-yellow px-8 py-4 text-sm font-bold text-black shadow-[0_0_40px_rgba(255,159,67,0.25)] transition-all hover:shadow-[0_0_60px_rgba(255,159,67,0.45)]"
          >
            Build the Future
          </a>
          <a
            href="#services"
            className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10"
          >
            Explore Services
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </div>
    </section>
  );
}
