import Image from "next/image";

export function ThemeShot({
  name,
  alt,
  sizes,
  priority = false,
}: {
  name: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <>
      {(["light", "dark"] as const).map((theme) => (
        <Image
          key={theme}
          className={`block h-auto w-full ${theme === "light" ? "dark:hidden" : "hidden dark:block"}`}
          src={`/images/showcase-v2/${name}-${theme}.webp`}
          alt={alt}
          width={2880}
          height={1800}
          sizes={sizes}
          loading={priority ? undefined : "lazy"}
          priority={priority}
        />
      ))}
    </>
  );
}

export function ShotFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl bg-(--q-bg-1) p-3 sm:p-4 bg-[radial-gradient(90%_120%_at_100%_0%,color-mix(in_srgb,var(--q-accent)_22%,transparent),transparent_70%)] ${className}`}
    >
      <div className="overflow-hidden rounded-lg border border-(--q-border) bg-(--q-bg-0) shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)]">
        {children}
      </div>
    </div>
  );
}
