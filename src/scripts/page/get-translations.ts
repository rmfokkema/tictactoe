import translations from '../../translations.json'

type TranslationKey = keyof typeof translations;
export type Translations = (typeof translations)[TranslationKey];

export function getTranslations(): Translations {
    const currentLanguage = window.navigator.language;
    const withSameKey = translations[currentLanguage as TranslationKey];
    if(withSameKey){
        return withSameKey;
    }
    for(const key of Object.getOwnPropertyNames(translations)){
        if(new RegExp(`^${key}-`,'i').test(currentLanguage)){
            return translations[key as TranslationKey]
        }
    }
    return translations.en;
}