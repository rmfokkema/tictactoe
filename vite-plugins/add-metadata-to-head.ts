import { type PluginOption } from 'vite'
import translations from '../src/translations.json'

type Language = keyof typeof translations;
export function addMetadataToHead(): PluginOption {
    let base: string;
    return {
        name: 'vite-plugin-add-head-metadata',
        configResolved(config) {
            base = config.base;
        },
        async transformIndexHtml(_, ctx){
            const language = getLanguage(ctx.filename);
            const { title, explanation } = translations[language];
            return [
                {
                    tag: 'meta',
                    attrs: {
                        charset: 'utf-8'
                    },
                    injectTo: 'head-prepend'
                },
                {
                    tag: 'meta',
                    attrs: {
                        name: 'viewport',
                        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                    },
                    injectTo: 'head-prepend'
                },
                {
                    tag: 'title',
                    children: title,
                    injectTo: 'head-prepend'
                },
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:title',
                        content: title
                    },
                    injectTo: 'head-prepend'
                },
                {
                    tag: 'meta',
                    attrs: {
                        property: 'og:description',
                        content: explanation
                    },
                    injectTo: 'head-prepend'
                },
                ...getOtherLanguages(language).map(l => ({
                    tag: 'link',
                    attrs: {
                        rel: 'alternate',
                        hreflang: l,
                        href: l === 'en' ? base : `${base}${l}/`
                    }
                }))
            ]
        }
    };
    function getLanguage(indexHtmlFileName: string): keyof typeof translations{
        const match = indexHtmlFileName.match(/(?:\/(\w{2})\/)index\.html$/);
        if(!match){
            return 'en'
        }
        return match[1] as keyof typeof translations
    }
    function getOtherLanguages(language: Language): Language[] {
        return (['en', 'de', 'fr', 'nl'] as const).filter(l => l !== language);
    }
}