import type { Theme } from "./theme";

export interface Themeable {
    setTheme(theme: Theme): void
}