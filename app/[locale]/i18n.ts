import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { i18nConfig } from '@/i18nConfig';

export default async function initI18next(lng: string, ns: string) {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`@/locales/${language}/${namespace}.json`)))
    .init({
      lng,
      ns,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: 'common',
      fallbackNS: 'common',
      preload: typeof window === 'undefined' ? i18nConfig.locales : [],
    });
  return i18nInstance;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function useTranslation(lng: string, ns: string = 'common', options: any = {}) {
  const i18nextInstance = await initI18next(lng, ns);
  return {
    t: i18nextInstance.getFixedT(lng, Array.isArray(ns) ? ns[0] : ns, options.keyPrefix),
    i18n: i18nextInstance,
    resources: i18nextInstance.services.resourceStore.data
  };
}
