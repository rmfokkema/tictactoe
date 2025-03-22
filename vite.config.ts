import { defineConfig } from 'vite'
import { fileURLToPath } from 'url';
import { addAliases } from './src/scripts/add-aliases';
import { injectInlineHeadScript } from './vite-plugins/inject-inline-head-script'
import { addIcon } from './vite-plugins/add-icon';
import { addMetadataToHead } from './vite-plugins/add-metadata-to-head';
import { injectInlineCss } from './vite-plugins/inject-inline-css';
import { addHtmlBody } from './vite-plugins/add-html-body';

export default defineConfig(() => {
    return {
        root: './src',
        plugins: [
            addMetadataToHead(),
            addHtmlBody(),
            injectInlineCss(),
            addIcon(),
            injectInlineHeadScript(),
            addAliases()
        ],
        build: {
            outDir: 'dist',
            rollupOptions: {
                input: [
                    fileURLToPath(new URL('./src/index.html', import.meta.url)),
                    fileURLToPath(new URL('./src/nl/index.html', import.meta.url)),
                    fileURLToPath(new URL('./src/de/index.html', import.meta.url)),
                    fileURLToPath(new URL('./src/fr/index.html', import.meta.url))
                ],
                output: {
                    inlineDynamicImports: false
                }
            }
        }
    }
})