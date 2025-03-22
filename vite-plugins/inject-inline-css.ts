import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import type { PluginOption } from "vite";

export function injectInlineCss(): PluginOption {
    let inlineCssContent: string | undefined;
    return {
        name: 'vite-plugin-inject-inline-css',
        async transformIndexHtml(){
            const inlineCssContent = await getInlineCssContent();
            return [
                {
                    tag: 'style',
                    children: inlineCssContent,
                    injectTo: 'head-prepend'
                }
            ]
        }
    }
    async function getInlineCssContent(): Promise<string>{
        if(inlineCssContent){
            return inlineCssContent;
        }
        const content = await readFile(fileURLToPath(new URL('../src/inline-main.css', import.meta.url)), {encoding: 'utf-8'});
        inlineCssContent = content;
        return content;
    }
}