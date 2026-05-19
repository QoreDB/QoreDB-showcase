"use server";

import { Resend } from "resend";
import { type OssProgramFormData, ossProgramSchema } from "@/lib/schemas";

const MIN_STARS = 1000;
const NOTIFY_TO = "qoredb@gmail.com";

type RepoInfo = {
  full_name: string;
  stargazers_count: number;
  html_url: string;
  owner: { login: string };
};

async function fetchRepo(owner: string, name: string): Promise<RepoInfo> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "QoreDB-OSS-Program",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`,
    { headers, next: { revalidate: 600 } },
  );
  if (!res.ok) {
    throw new Error(`GitHub ${res.status}`);
  }
  return (await res.json()) as RepoInfo;
}

export async function applyOssProgram(data: OssProgramFormData) {
  const parsed = ossProgramSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false as const,
      error: "Invalid submission",
    };
  }

  const { email, githubUsername, repo, note, address } = parsed.data;
  if (address) return { success: true as const, status: "received" as const };

  const [owner, name] = repo.split("/");
  let repoInfo: RepoInfo;
  try {
    repoInfo = await fetchRepo(owner, name);
  } catch {
    return {
      success: false as const,
      error: "We couldn’t find that repository on GitHub.",
    };
  }

  if (repoInfo.stargazers_count < MIN_STARS) {
    return {
      success: false as const,
      error: `This repo has ${repoInfo.stargazers_count} stars. The program requires at least ${MIN_STARS}.`,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "QoreDB OSS Program <onboarding@resend.dev>",
        to: [NOTIFY_TO],
        replyTo: email,
        subject: `[OSS Program] ${repoInfo.full_name} (${repoInfo.stargazers_count}⭐)`,
        text: [
          `New OSS Program application.`,
          ``,
          `Applicant email: ${email}`,
          `GitHub user:     ${githubUsername}`,
          `Repository:      ${repoInfo.html_url}`,
          `Stars:           ${repoInfo.stargazers_count}`,
          `Repo owner:      ${repoInfo.owner.login}`,
          ``,
          `Note:`,
          note?.trim() || "(none)",
        ].join("\n"),
      });
    } catch (error) {
      console.error("[oss-program] resend failure:", error);
    }
  } else {
    console.warn(
      "[oss-program] RESEND_API_KEY missing — application logged only:",
      {
        email,
        githubUsername,
        repo: repoInfo.full_name,
        stars: repoInfo.stargazers_count,
      },
    );
  }

  return {
    success: true as const,
    status: "received" as const,
    stars: repoInfo.stargazers_count,
  };
}
