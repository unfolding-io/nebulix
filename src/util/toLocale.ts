let lang = import.meta.env.WEBSITE_LANGUAGE;
let currency = import.meta.env.CURRENCY;

if(!lang && typeof document === 'undefined') {
    throw new Error("WEBSITE_LANGUAGE is not defined, please define it in .env file or rename the env.txt to .env");
}
if (!lang) lang = document.documentElement.lang;
if (!currency)
    currency = document.documentElement.dataset.currency
        ? document.documentElement.dataset.currency
        : 'USD';

let langCode = 'en-US';
if (lang.length === 2) langCode = `${lang}-${lang.toUpperCase()}`;
if (lang === 'en') langCode = 'en-US';
if (lang.length === 5) langCode = lang;

export function formatDate(date: Date): string {
    const newDate = date.toLocaleDateString(langCode, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    return newDate;
}

export function formatPrice(price: number): string {
    const formattedPrice = new Intl.NumberFormat(langCode, {
        style: 'currency',
        currency: currency
    }).format(price);

    return formattedPrice.replaceAll(/\s/g, '');
}