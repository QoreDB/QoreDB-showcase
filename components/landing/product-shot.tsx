import Image from "next/image";

// Captures come in pairs from scripts/showcase-media: same scene, both app themes.
// Both are lazy, so the one hidden by the site theme is never downloaded.
export function ProductShot({
  name,
  alt,
  sizes,
}: {
  name: string;
  alt: string;
  sizes: string;
}) {
  return (
    <>
      {(["light", "dark"] as const).map((theme) => (
        <Image
          key={theme}
          className={`q-shot q-shot-${theme}`}
          src={`/images/showcase-v2/${name}-${theme}.webp`}
          alt={alt}
          width={2880}
          height={1800}
          sizes={sizes}
          loading="lazy"
          fetchPriority="low"
        />
      ))}
    </>
  );
}
