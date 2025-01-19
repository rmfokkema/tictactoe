import { Theme } from "../themes";

export interface Themeable {
    setTheme(theme: Theme): void
}