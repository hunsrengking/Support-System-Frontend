import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";

// i18n configuration
i18n
  .use(HttpBackend) // load translations from /public/locales
  .use(initReactI18next)
  .init({
    lng: "en", // default language
    fallbackLng: "en", // fallback if translation is missing
    backend: {
      loadPath: "/locales/{{lng}}/translation.json"
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
