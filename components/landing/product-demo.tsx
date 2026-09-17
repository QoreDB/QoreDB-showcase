import { useTranslation as getTranslation } from "@/app/[locale]/i18n";
import { ProductDemoPlayer } from "./product-demo-player";
import "./demo.css";

const VIDEO_SOURCE = "/videos/qoredb-workflow.mp4";
// Same scene as the film's ending, captured without the filming pointer.
const VIDEO_POSTER = "/images/showcase-v2/query-workspace-dark.webp";
const VIDEO_DURATION = "00:32";

export async function ProductDemo({ locale }: { locale: string }) {
  const { t } = await getTranslation(locale, "common");
  const steps = t("home.demo.steps", { returnObjects: true }) as string[];

  return (
    <section
      id="preview"
      className="q-demo"
      aria-labelledby="product-demo-title"
    >
      <div className="q-demo-heading">
        <h3 id="product-demo-title">{t("home.demo.title")}</h3>
        <p className="q-demo-meta">
          {VIDEO_DURATION} · {t("home.demo.silent")}
        </p>
      </div>
      <ProductDemoPlayer
        source={VIDEO_SOURCE}
        poster={VIDEO_POSTER}
        title={t("home.demo.title")}
        posterAlt={t("home.demo.posterAlt")}
        playLabel={t("home.demo.play")}
        loadingLabel={t("home.demo.loading")}
        errorLabel={t("home.demo.error")}
        retryLabel={t("home.demo.retry")}
        fallbackLabel={t("home.demo.open")}
        durationLabel={VIDEO_DURATION}
        width={1920}
        height={1200}
      />
      <details className="q-demo-transcript" id="product-demo-transcript">
        <summary>{t("home.demo.transcript")}</summary>
        <ol>
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </details>
    </section>
  );
}
