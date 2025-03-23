import { type PluginOption, type ViteDevServer } from 'vite'
import { faviconFileName } from './constants';

export function addIcon(): PluginOption {
    let publicBase: string | undefined;
    let devServer: ViteDevServer | undefined;
    let baseUrl: string | undefined;
    return {
        name: 'vite-plugin-add-icon-link',
        configResolved(config) {
            publicBase = config.base;
        },
        configureServer(server){
            devServer = server;
        },
        transformIndexHtml(){
            return [
                {
                    tag: 'link',
                    attrs: {
                        rel: 'icon',
                        href: getFullAssetUrl(faviconFileName),
                        sizes: 'any'
                    }
                }
            ]
        }
    };
    function getFullAssetUrl(assetFileName: string): string {
        return new URL(`${publicBase}${assetFileName}`, (baseUrl || (baseUrl = getBaseUrl()))).toString();
    }
    function getBaseUrl(): string {
        if(!devServer){
            return 'https://emilefokkema.github.io'
        }
        const resolvedUrls = devServer.resolvedUrls;
        if(!resolvedUrls){
            throw new Error('dev server should have resolved urls now')
        }
        const networkResolvedUrls = resolvedUrls.network;
        if(networkResolvedUrls.length > 0){
            return networkResolvedUrls[0];
        }
        const localResolvedUrls = resolvedUrls.local;
        if(localResolvedUrls.length === 0){
            throw new Error('no local resolved url found on dev server')
        }
        return localResolvedUrls[0];
    }
}