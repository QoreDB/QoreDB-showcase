"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { documentInternationalization } from "@sanity/document-internationalization";
import { SUPPORTED_LOCALES, LOCALE_LABELS } from "./lib/locale";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
    documentInternationalization({
      supportedLanguages: SUPPORTED_LOCALES.map((id) => ({
        id,
        title: LOCALE_LABELS[id],
      })),
      schemaTypes: ["post"],
    }),
  ],
});
