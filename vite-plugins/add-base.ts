import type { PluginOption } from "vite";

export function addBase(): PluginOption {
    return {
        name: 'vite-plugin-add-base',
        apply: 'build',
        config(){
            return {base: '/'}
        }
    }
}