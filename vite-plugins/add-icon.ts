import { type PluginOption } from 'vite'
import { createIcon } from '../src/scripts/assets/create-icon';

export function addIcon(): PluginOption {
    const darkIconUrl = `data:image/svg+xml,${encodeURIComponent(createIcon('dark'))}`;
    const lightIconUrl = `data:image/svg+xml,${encodeURIComponent(createIcon('light'))}`;
    return {
        name: 'vite-plugin-add-icon-urls',
        transformIndexHtml(){
            return [
                {
                    tag: 'link',
                    attrs: {
                        rel: 'icon',
                        href: darkIconUrl,
                        id: 'icon'
                    }
                }
            ]
        },
        config(){
            return {
                define: {
                    DARK_ICON: `'${darkIconUrl}'`,
                    LIGHT_ICON: `'${lightIconUrl}'`
                }
            }
        }
    };
}