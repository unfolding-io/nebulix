
interface Locale {
    [key: string]: string;
}
import nl from '@locales/nl.json';
import en from '@locales/en.json';
import de from '@locales/de.json';
import es from '@locales/es.json';
const lang = import.meta.env.WEBSITE_LANGUAGE;
export const t = (field: string): string => {
    const translations: Record<string, Locale>  = {
        en: en,
        nl: nl,
        es: es,
        de: de
    };

    if (translations[lang] && translations[lang][field]) {
        return translations[lang][field];
    }

    if (translations['en'] && translations['en'][field]) {
        return translations['en'][field];
    }

    return field;
};