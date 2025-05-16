import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["en", "zh", "zh-TW", "es", "pt", "ar", "hi", "ja", "de", "fr", "ko", "ru"],
 
  // Used when no locale matches
  defaultLocale: 'en'
});