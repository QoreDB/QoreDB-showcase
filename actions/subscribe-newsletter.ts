"use server";

import { Resend } from "resend";
import { type NewsletterFormData, newsletterSchema } from "@/lib/schemas";

const NOTIFY_TO = "qoredb@gmail.com";

const WELCOME_MAILS: Record<string, { subject: string; body: string }> = {
  fr: {
    subject: "Bienvenue dans la newsletter QoreDB !",
    body: "Bonjour,\n\nMerci de vous être inscrit à la newsletter QoreDB !\n\nVoici votre cadeau de bienvenue : la fiche mémo d'optimisation SQL & SQLite (PDF) :\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\nNous vous tiendrons informé des nouveautés, des tutoriels, des mises à jour majeures et des coulisses du projet.\n\nÀ bientôt,\nL'équipe QoreDB\nhttps://www.qoredb.com",
  },
  en: {
    subject: "Welcome to the QoreDB newsletter!",
    body: "Hello,\n\nThank you for subscribing to the QoreDB newsletter!\n\nHere is your welcome gift – the SQL & SQLite Optimization Cheat Sheet (PDF):\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\nWe will keep you updated on the latest news, tutorials, major updates, and behind-the-scenes stories of the project.\n\nBest regards,\nThe QoreDB Team\nhttps://www.qoredb.com",
  },
  de: {
    subject: "Willkommen beim QoreDB-Newsletter!",
    body: "Hallo,\n\nvielen Dank für Ihr Abonnement des QoreDB-Newsletters!\n\nHier ist Ihr Willkommensgeschenk – das SQL & SQLite-Optimierungs-Cheat-Sheet (PDF):\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\nWir werden Sie über die neuesten Nachrichten, Anleitungen, wichtige Updates und Blicke hinter die Kulissen des Projekts auf dem Laufenden halten.\n\nMit freundlichen Grüßen\nDas QoreDB-Team\nhttps://www.qoredb.com",
  },
  es: {
    subject: "¡Bienvenido al boletín de QoreDB!",
    body: "Hola,\n\n¡Gracias por suscribirse al boletín de QoreDB!\n\nAquí tiene su regalo de bienvenida: la hoja de trucos de optimización de SQL y SQLite (PDF):\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\nLe mantendremos informado sobre las últimas novedades, tutoriales, actualizaciones importantes y el detrás de escena del proyecto.\n\nAtentamente,\nEl equipo de QoreDB\nhttps://www.qoredb.com",
  },
  it: {
    subject: "Benvenuto nella newsletter di QoreDB!",
    body: "Ciao,\n\nGrazie per esserti iscritto alla newsletter di QoreDB!\n\nEcco il tuo regalo di benvenuto: il cheat sheet per l'ottimizzazione di SQL e SQLite (PDF):\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\nTi terremo aggiornato sulle ultime novità, tutorial, aggiornamenti importanti e dietro le quinte del progetto.\n\nCordiali saluti,\nIl team di QoreDB\nhttps://www.qoredb.com",
  },
  zh: {
    subject: "欢迎订阅 QoreDB 新闻邮件！",
    body: "您好，\n\n感谢您订阅 QoreDB 新闻邮件！\n\n这是您的欢迎礼品 - SQL & SQLite 性能优化速查表 (PDF):\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\n我们将向您发送有关该项目的最新动态、教程、重大更新以及幕后故事。\n\n顺致商祺，\nQoreDB 团队\nhttps://www.qoredb.com",
  },
  ja: {
    subject: "QoreDB ニュースレターへようこそ！",
    body: "こんにちは、\n\nQoreDB ニュースレターにご購読いただき、ありがとうございます！\n\n購読特典の「SQL & SQLite 性能最適化チートシート（PDF）」をこちらからダウンロードいただけます：\nhttps://www.qoredb.com/downloads/qoredb-sql-cheatsheet.pdf\n\nプロジェクトの最新ニュース、チュートリアル、重要なアップデート、開発の裏話などをお届けします。\n\nよろしくお願いいたします。\nQoreDB チーム\nhttps://www.qoredb.com",
  },
};

export async function subscribeNewsletter(
  data: NewsletterFormData,
  locale = "en",
) {
  const parsed = newsletterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false as const, error: "Invalid email" };
  }

  const { email, source, address } = parsed.data;

  // Honeypot check
  if (address) {
    return { success: true as const };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[newsletter] RESEND_API_KEY missing — logged only:", {
      email,
      source,
    });
    return { success: true as const };
  }

  const resend = new Resend(apiKey);
  const audienceId = process.env.RESEND_NEWSLETTER_AUDIENCE_ID;

  try {
    // 1. Add contact to Resend Audience if configured
    if (audienceId) {
      await resend.contacts.create({
        email,
        audienceId,
        unsubscribed: false,
      });
    }

    // 2. Send notification to admin
    await resend.emails.send({
      from: "QoreDB Newsletter <onboarding@resend.dev>",
      to: [NOTIFY_TO],
      subject: `[Newsletter Signup] ${email}`,
      text: `New newsletter signup.\n\nEmail: ${email}\nSource: ${source ?? "newsletter-page"}\nLocale: ${locale}\n`,
    });

    // 3. Send welcome email to subscriber
    const welcomeMail = WELCOME_MAILS[locale] || WELCOME_MAILS.en;
    const fromEmail =
      process.env.NEWSLETTER_FROM_EMAIL ??
      "QoreDB <newsletter@mail.qoredb.com>";

    await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: welcomeMail.subject,
      text: welcomeMail.body,
    });

    return { success: true as const };
  } catch (error) {
    console.error("[newsletter] failed", error);
    return { success: false as const, error: "Submission failed" };
  }
}
