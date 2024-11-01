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
    get loserTheme(): Theme { return darkTheme; },
    get winnerTheme(): Theme { return lightTheme; }
}

export const darkThemeWinnerTheme: Theme = {
    backgroundColor: palette.middle,
    color: palette.dark,
    get loserTheme(): Theme {return darkTheme; },
    get winnerTheme(): Theme { return darkThemeWinnerTheme; }
}

export const darkTheme: Theme = {
    backgroundColor: palette.dark,
    color: palette.middle,
    get loserTheme(): Theme { return darkTheme; },
    get winnerTheme(): Theme { return darkThemeWinnerTheme; }
};