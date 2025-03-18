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
}

run();