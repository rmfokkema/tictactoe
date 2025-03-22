import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { type PluginOption } from 'vite'
import { readFile } from 'fs/promises';
import { inlineHeadScriptFilePath } from './constants';


export function injectInlineHeadScript(): PluginOption[] {
    let inlineHeadScriptContent: string | undefined;
    return [
        {
            enforce: 'pre',
            name: 'vite-plugin-inline-head-script',
            async transformIndexHtml() {
                const content = await getInlineScriptContent();
                return [
                    {
                        tag: 'script',
                        children: content,
                        injectTo: 'head'
                    }
                ];
            }
        }
    ];
    async function getInlineScriptContent(): Promise<string>{
        if(inlineHeadScriptContent === undefined){
            await new Promise<void>((res, rej) => {
                exec(
                    'npm run build-inline',
                    {cwd: fileURLToPath(new URL('..', import.meta.url))},
                (err, stdout) => {
                    if(err){
                        rej(err);
                        return;
                    }
                    console.log(stdout)
                    res();
                })
            })
            inlineHeadScriptContent = await readFile(inlineHeadScriptFilePath, {encoding: 'utf-8'});
        }
        return inlineHeadScriptContent;
    }
}