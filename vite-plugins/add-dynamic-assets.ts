import type { PluginOption } from "vite"
import { createIcon } from "../src/scripts/assets/create-icon"
import { faviconFileName } from "./constants"

export interface DynamicAsset {
    fileName: string
    contentType: string
    getContent: () => string
}

const dynamicAssets: DynamicAsset[] = [
    {
        fileName: faviconFileName,
        contentType: 'image/svg+xml',
        getContent(){return createIcon();}
    }
]

function addDynamicAssets(assets: DynamicAsset[]): PluginOption[] {
    const assetContents = assets.map((a) => ({asset: a, content: a.getContent()}));

    return [
        {
            name: 'vite-plugin-serve-dynamic-assets',
            apply: 'serve',
            configureServer(server){
                server.middlewares.use((req, res, next) => {
                    const match = (req.url || '').match(/^\/([^/]*)$/);
                    if(!match){
                        next();
                        return;
                    }
                    const assetContent = assetContents.find(({asset}) => asset.fileName === match[1]);
                    if(!assetContent){
                        next();
                        return;
                    }
                    const { content, asset: {contentType}} = assetContent;
                    res.setHeader('Content-Type', contentType);
                    res.write(content);
                    res.end();
                })
            }
        },
        {
            name: 'vite-plugin-emit-dynamic-assets',
            apply: 'build',
            buildEnd(){
                for(const assetContent of assetContents){
                    this.emitFile({
                        type: 'asset',
                        source: assetContent.content,
                        fileName: assetContent.asset.fileName
                    })
                }
            }
        }
    ]
}

const addThem = () => addDynamicAssets(dynamicAssets)

export { addThem as addDynamicAssets }