import type { ReactNode } from "react";

export function Steps({ children }: { children: ReactNode }) {
  return (
    <ol className="docs-steps relative my-6 ml-6 list-none border-l border-(--q-border) pl-6 [counter-reset:steps]">
      {children}
    </ol>
  );
}
