import type { PluginOption } from 'vite'
import { fileURLToPath } from 'url'

const sharedDirectoryPath = fileURLToPath(new URL('./shared', import.meta.url))
const pageDirectoryPath = fileURLToPath(new URL('./page', import.meta.url))

export function addAliases(): PluginOption {
    return {
        name: 'vite-plugin-scripts-add-aliases',
        config: () => {
            return {
                resolve: {
                    alias: {
                        '@shared': sharedDirectoryPath,
                        '@page': pageDirectoryPath
                      }
                }
            }
        }
    }
}