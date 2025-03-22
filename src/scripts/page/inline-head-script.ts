import { readThemeFromLocalStorage } from "./themes/local-storage-theme-preference-persister";
import { getTranslations } from "./get-translations";

function run(): void {
    const persisted = readThemeFromLocalStorage();
    if(persisted === 'light'){
        document.documentElement.classList.add('light');
    }
    if(persisted === 'dark'){
        document.documentElement.classList.add('dark');
    }
    document.title = getTranslations().title;
    const iconLink = document.getElementById('icon')!;
    iconLink.setAttribute('rel', 'icon');
    iconLink.setAttribute('id', 'icon')
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    iconLink.setAttribute('href', prefersDark ? DARK_ICON : LIGHT_ICON);
}

run();