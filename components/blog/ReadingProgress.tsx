"use client";

import { useEffect, useState } from "react";

export function ReadingProgress({
  targetId,
  label = "Reading progress",
}: {
  targetId: string;
  label?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const start = target.offsetTop;
      const distance = Math.max(1, target.offsetHeight - window.innerHeight);
      const nextProgress = Math.min(
        100,
        Math.max(0, ((window.scrollY - start) / distance) * 100),
      );
      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [targetId]);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-(--q-accent) transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
