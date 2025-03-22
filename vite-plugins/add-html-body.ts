import { fileURLToPath } from "url";
import path from 'path'
import type { PluginOption } from "vite";

export function addHtmlBody(): PluginOption {
    const mainTsPath = fileURLToPath(new URL('../src/scripts/page/main.ts', import.meta.url));
    return {
        name: 'vite-plugin-add-html-body',
        transformIndexHtml: {
            order: 'pre',
            handler(_, ctx){
                const indexHtmlDir = path.dirname(ctx.filename)
                const relative = path.relative(indexHtmlDir, mainTsPath);
                return [
                    {
                        tag: 'canvas',
                        attrs: {
                            id: 'canvas'
                        },
                        injectTo: 'body'
                    },
                    {
                        tag: 'script',
                        attrs: {
                            type: 'module',
                            src: relative
                        }
                    }
                ]
            }
        }
    }
}