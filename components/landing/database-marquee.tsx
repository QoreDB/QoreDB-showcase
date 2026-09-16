"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export function DatabaseMarquee({
  children,
  pauseLabel,
  resumeLabel,
}: {
  children: ReactNode;
  pauseLabel: string;
  resumeLabel: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(element);
    setReady(true);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={root}
      className="q-home-drivers"
      data-ready={ready}
      data-playing={visible && !paused}
    >
      <div className="q-home-drivers-viewport">
        <div className="q-home-drivers-track">
          {children}
          <div className="q-home-drivers-duplicate" aria-hidden="true">
            {children}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="q-home-drivers-pause"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? resumeLabel : pauseLabel}
        title={paused ? resumeLabel : pauseLabel}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          {paused ? (
            <path d="m5 3 8 5-8 5Z" fill="currentColor" />
          ) : (
            <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />
          )}
        </svg>
      </button>
    </div>
  );
}
