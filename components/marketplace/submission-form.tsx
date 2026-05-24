"use client";

import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Kind = "declarative" | "executable";
type Category =
  | "safety"
  | "observability"
  | "productivity"
  | "theming"
  | "integrations";

const CATEGORIES: Category[] = [
  "safety",
  "observability",
  "productivity",
  "theming",
  "integrations",
];

interface SubmissionState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  email?: string;
}

export function SubmissionForm() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<Kind>("executable");
  const [category, setCategory] = useState<Category>("productivity");
  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const checklist = (
    t("marketplace.submit.checklist_items", { returnObjects: true }) as unknown
  ) as string[];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/plugins/submit", {
        method: "POST",
        body: data,
      });
      const json = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) {
        setState({
          status: "error",
          message: json.error ?? `Request failed (HTTP ${response.status})`,
        });
        return;
      }
      const email = (data.get("contactEmail") ?? "").toString();
      setState({ status: "success", email });
      form.reset();
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  if (state.status === "success") {
    return (
      <Alert>
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>{t("marketplace.submit.success_title")}</AlertTitle>
        <AlertDescription>
          {t("marketplace.submit.success_body", { email: state.email ?? "" })}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {state.status === "error" ? (
        <Alert variant="destructive">
          <AlertTitle>{t("marketplace.submit.error_title")}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="rounded-xl border border-(--q-border) bg-(--q-bg-1) p-5">
        <h3 className="mb-3 text-sm font-medium text-(--q-text-0)">
          {t("marketplace.submit.checklist_title")}
        </h3>
        <ul className="space-y-1.5 text-sm text-(--q-text-1)">
          {checklist.map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-(--q-accent)">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("marketplace.submit.field_plugin_id")} required>
          <Input
            name="pluginId"
            required
            pattern="^[a-z0-9][a-z0-9._\-]*$"
            placeholder="acme.linter"
          />
          <Hint>{t("marketplace.submit.field_plugin_id_hint")}</Hint>
        </Field>
        <Field label={t("marketplace.submit.field_name")} required>
          <Input name="name" required placeholder="SQL Linter" />
        </Field>
        <Field label={t("marketplace.submit.field_version")} required>
          <Input name="version" required placeholder="1.0.0" />
        </Field>
        <Field label={t("marketplace.submit.field_kind")} required>
          <div className="space-y-1.5 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="kind"
                value="declarative"
                checked={kind === "declarative"}
                onChange={() => setKind("declarative")}
              />
              {t("marketplace.submit.field_kind_declarative")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="kind"
                value="executable"
                checked={kind === "executable"}
                onChange={() => setKind("executable")}
              />
              {t("marketplace.submit.field_kind_executable")}
            </label>
          </div>
        </Field>
        <Field
          label={t("marketplace.submit.field_category")}
          required
          className="sm:col-span-2"
        >
          <div className="grid gap-1.5 text-sm sm:grid-cols-2">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={c}
                  checked={category === c}
                  onChange={() => setCategory(c)}
                />
                {t(`marketplace.categories.${c}`)}
              </label>
            ))}
          </div>
          <Hint>{t("marketplace.submit.field_category_hint")}</Hint>
        </Field>
        <Field
          label={t("marketplace.submit.field_description")}
          className="sm:col-span-2"
        >
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border border-(--q-border) bg-(--q-bg-0) px-3 py-2 text-sm text-(--q-text-0)"
          />
        </Field>
        <Field label={t("marketplace.submit.field_author")}>
          <Input name="author" placeholder="Acme Corp" />
        </Field>
        <Field label={t("marketplace.submit.field_contact_email")} required>
          <Input type="email" name="contactEmail" required />
          <Hint>{t("marketplace.submit.field_contact_email_hint")}</Hint>
        </Field>
        <Field
          label={t("marketplace.submit.field_repository_url")}
          className="sm:col-span-2"
        >
          <Input type="url" name="repositoryUrl" placeholder="https://github.com/…" />
        </Field>
        <Field
          label={t("marketplace.submit.field_manifest")}
          required
          className="sm:col-span-2"
        >
          <textarea
            name="manifest"
            required
            rows={12}
            className="w-full rounded-md border border-(--q-border) bg-(--q-bg-0) px-3 py-2 font-mono text-xs text-(--q-text-0)"
            placeholder='{ "id": "acme.linter", "name": "...", "version": "1.0.0", ... }'
          />
          <Hint>{t("marketplace.submit.field_manifest_hint")}</Hint>
        </Field>
        <Field
          label={t("marketplace.submit.field_archive")}
          required
          className="sm:col-span-2"
        >
          <Input
            type="file"
            name="archive"
            required
            accept=".zip,application/zip"
          />
          <Hint>{t("marketplace.submit.field_archive_hint")}</Hint>
        </Field>
      </div>

      <Button
        type="submit"
        disabled={state.status === "submitting"}
        className="gap-1.5"
      >
        {state.status === "submitting" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Upload size={14} />
        )}
        {state.status === "submitting"
          ? t("marketplace.submit.submitting")
          : t("marketplace.submit.submit_button")}
      </Button>
    </form>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-(--q-text-0)">
        {label}
        {required ? <span className="ml-0.5 text-(--q-accent)">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-(--q-text-2)">{children}</p>;
}
