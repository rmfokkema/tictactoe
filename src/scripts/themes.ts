import { palette } from "./palette"

export interface Theme {
    readonly backgroundColor: string
    readonly color: string
    readonly loserTheme: Theme
    readonly winnerTheme: Theme
}

export const lightTheme: Theme = {
    backgroundColor: palette.light,
    color: palette.dark,
    get loserTheme(): Theme { return lessLightTheme; },
    get winnerTheme(): Theme { return lightTheme; }
}

export const lessLightTheme: Theme = {
    backgroundColor: palette.middle,
    color: palette.dark,
    get loserTheme(): Theme { return lessLightTheme; },
    get winnerTheme(): Theme { return lightTheme; }
}

