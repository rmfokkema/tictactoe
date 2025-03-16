import type { ThemePreference, ThemePreferencePersister } from "./theme-preference-persister";

const localStorageKey = 'theme';

export function readThemeFromLocalStorage(): string | null {
    return window.localStorage.getItem(localStorageKey);
}

function storeThemeInLocalStorage(preference: ThemePreference): void {
    if(preference === null){
        window.localStorage.removeItem(localStorageKey);
    }else{
        window.localStorage.setItem(localStorageKey, preference);
    }
}

export class LocalStorageThemePreferencePersister implements ThemePreferencePersister{
    public persist(preference: ThemePreference): void {
        const locks = window.navigator.locks;
        if(!locks){
            storeThemeInLocalStorage(preference);
            return;
        }
        locks.request(
            'updatelocalstoragetheme',
            {
                mode: 'exclusive',
                ifAvailable: true
            },
            (lock) => {
                if(!lock){
                    return;
                }
                storeThemeInLocalStorage(preference);
            }
        )
    }
    public read(): string | null {
        return readThemeFromLocalStorage();
    }
}