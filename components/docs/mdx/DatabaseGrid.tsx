import Image from "next/image";
import Link from "next/link";
import { DATABASE_GROUPS } from "@/lib/databases";

// Same source as the home page wall, so both lists stay in sync.
export function DatabaseGrid({ group }: { group: string }) {
  const databases =
    DATABASE_GROUPS.find((item) => item.key === group)?.databases ?? [];
  return (
    <ul className="not-prose my-6 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3">
      {databases.map((database) => (
        <li key={database.name}>
          <Link
            href={database.doc}
            prefetch={false}
            className="flex min-h-12 items-center gap-3 rounded-xl bg-(--q-bg-1) px-3.5 py-2.5 text-sm font-medium text-(--q-text-0) transition-colors hover:bg-(--q-bg-2)"
          >
            <Image
              src={database.image}
              alt=""
              width={24}
              height={24}
              sizes="24px"
              loading="lazy"
              className="q-database-logo size-5 shrink-0 object-contain"
            />
            {database.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
