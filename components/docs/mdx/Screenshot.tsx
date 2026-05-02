import { Camera, ImageOff } from "lucide-react";
import Image from "next/image";

type Props = {
  /** Path under /public, e.g. "/images/docs/installation/macos-dmg.png". */
  src?: string;
  /** Required for accessibility. Also used as the placeholder title. */
  alt: string;
  /** Optional caption rendered under the image. */
  caption?: string;
  /**
   * Description of the screenshot to capture. When set (and no `src` is
   * provided) the component renders a placeholder card with this text,
   * so the writer knows exactly what to capture.
   */
  todo?: string;
  /** Image dimensions. Defaults match a 16:10 desktop capture. */
  width?: number;
  height?: number;
};

export function Screenshot({
  src,
  alt,
  caption,
  todo,
  width = 1600,
  height = 1000,
}: Props) {
  if (!src) {
    return (
      <figure className="not-prose my-8">
        <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-(--q-accent)/40 bg-(--q-accent-soft)/30 px-6 py-10">
          <div className="max-w-xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--q-accent-soft) px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-(--q-accent-strong)">
              {todo ? (
                <Camera className="size-3.5" />
              ) : (
                <ImageOff className="size-3.5" />
              )}
              {todo ? "Screenshot to capture" : "Image missing"}
            </span>
            <p className="mt-3 font-heading text-base font-semibold text-(--q-text-0)">
              {alt}
            </p>
            {todo ? (
              <p className="mt-1.5 text-sm text-(--q-text-2)">{todo}</p>
            ) : null}
          </div>
        </div>
        {caption ? (
          <figcaption className="mt-2 text-center text-xs text-(--q-text-2)">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <figure className="not-prose my-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-auto w-full rounded-xl border border-(--q-border) shadow-sm"
        sizes="(max-width: 1024px) 100vw, 80vw"
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs text-(--q-text-2)">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
