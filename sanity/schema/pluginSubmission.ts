import { defineField, defineType } from "sanity";

// Pending-plugin queue. The marketplace API never publishes anything from
// here directly — the bytes only become reachable to the QoreDB app once a
// maintainer approves the submission and commits it to the
// `qoredb-plugins-registry` repo. This document type is the admin-side
// review surface, with the uploaded archive attached.
export default defineType({
  name: "pluginSubmission",
  title: "Plugin submission",
  type: "document",
  fields: [
    defineField({
      name: "pluginId",
      title: "Plugin id",
      type: "string",
      description:
        "Reverse-DNS id, e.g. acme.linter. Must match plugin.json#id once the archive is unpacked.",
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9][a-z0-9._-]*$/, {
          name: "plugin id",
          invert: false,
        }),
    }),
    defineField({
      name: "name",
      title: "Display name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "author",
      title: "Author / maintainer",
      type: "string",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      description:
        "Used to reach the submitter for questions or to notify of approval / rejection.",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "repositoryUrl",
      title: "Source repository",
      type: "url",
      description: "Optional — link to the source the WASM was built from.",
    }),
    defineField({
      name: "kind",
      title: "Plugin kind",
      type: "string",
      options: {
        list: [
          { title: "Declarative (no WASM)", value: "declarative" },
          { title: "Executable (WASM runtime)", value: "executable" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "archive",
      title: "plugin.zip",
      type: "file",
      description:
        "The flat archive containing plugin.json and the WASM (if executable). Same shape QoreDB's install_plugin command consumes.",
      options: { accept: ".zip,application/zip" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "manifest",
      title: "plugin.json (parsed)",
      type: "text",
      rows: 14,
      description:
        "Paste the plugin.json verbatim. Used by reviewers to check capabilities / hooks / integrity before approving.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "status",
      title: "Review status",
      type: "string",
      options: {
        list: [
          { title: "Pending review", value: "pending" },
          { title: "Approved (live)", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "reviewerNotes",
      title: "Reviewer notes",
      type: "text",
      rows: 3,
      description:
        "Visible to reviewers only. Used to capture the reason for a rejection or any follow-up asked from the submitter.",
    }),
    defineField({
      name: "registryUrl",
      title: "Registry URL (once approved)",
      type: "url",
      description:
        "Set after the plugin lands in qoredb-plugins-registry. Mirrors archive.url from index.json.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      pluginId: "pluginId",
      version: "version",
      status: "status",
    },
    prepare({ title, pluginId, version, status }) {
      const badge =
        status === "approved" ? "✓" : status === "rejected" ? "✗" : "•";
      return {
        title: `${badge} ${title ?? pluginId} ${version ? `@${version}` : ""}`,
        subtitle: `${pluginId ?? "?"} — ${status ?? "pending"}`,
      };
    },
  },
  orderings: [
    {
      title: "Newest submissions first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
    {
      title: "Pending first",
      name: "statusPending",
      by: [
        { field: "status", direction: "asc" },
        { field: "submittedAt", direction: "desc" },
      ],
    },
  ],
});
