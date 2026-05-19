"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { applyOssProgram } from "@/actions/apply-oss-program";

export function OssProgramForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [repo, setRepo] = useState("");
  const [note, setNote] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await applyOssProgram({
        email,
        githubUsername,
        repo,
        note: note || undefined,
        address: honeypot,
      });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? t("oss_program.error_generic"));
      }
    });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
        <Check className="w-6 h-6 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-semibold text-(--q-text-0)">
          {t("oss_program.success_title")}
        </h3>
        <p className="text-sm text-(--q-text-1) mt-1">
          {t("oss_program.success_body")}
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label={t("oss_program.fields.email")}>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) focus:border-(--q-accent) focus:outline-none transition-colors"
        />
      </Field>

      <Field label={t("oss_program.fields.github_username")}>
        <input
          type="text"
          required
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          placeholder="octocat"
          className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) focus:border-(--q-accent) focus:outline-none transition-colors"
        />
      </Field>

      <Field
        label={t("oss_program.fields.repo")}
        hint={t("oss_program.fields.repo_hint")}
      >
        <input
          type="text"
          required
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="owner/repo"
          className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) focus:border-(--q-accent) focus:outline-none transition-colors"
        />
      </Field>

      <Field
        label={t("oss_program.fields.note")}
        hint={t("oss_program.fields.note_hint")}
      >
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-(--q-border) bg-(--q-bg-0) px-4 py-3 text-sm text-(--q-text-0) focus:border-(--q-accent) focus:outline-none transition-colors resize-y"
        />
      </Field>

      <input
        type="text"
        name="address"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--q-accent) text-white px-4 py-3 text-sm font-semibold transition hover:bg-(--q-accent-strong) disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          t("oss_program.submit")
        )}
      </button>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: the input is passed via children
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-(--q-text-0)">{label}</span>
      {children}
      {hint ? (
        <span className="block text-xs text-(--q-text-2)">{hint}</span>
      ) : null}
    </label>
  );
}
