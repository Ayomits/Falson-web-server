import i18n from 'i18next';
import middleware from 'i18next-express-middleware';
import { en, ru } from './translations';

i18n.use(middleware.LanguageDetector).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  fallbackLng: 'en',
  preload: ['en', 'ru'],
});

export default i18n
