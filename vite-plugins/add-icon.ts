import { type PluginOption } from 'vite'
import { createIcon } from '../src/scripts/assets/create-icon';

export function addIcon(): PluginOption {
    const iconUrl = `data:image/svg+xml,${encodeURIComponent(createIcon())}`;
    return {
        name: 'vite-plugin-add-icon-urls',
        transformIndexHtml(){
            return [
                {
                    tag: 'link',
                    attrs: {
                        rel: 'icon',
                        href: iconUrl,
                        id: 'icon'
                    }
                }
            ]
        },
        config(){
            return {
                define: {
                    ICON_URL: `'${iconUrl}'`
                }
            }
        }
    };
}