import type { ChannelLike } from "./channel-like";
import { isRequest, type ResponseErrorMessage, type ResponseMessage } from "./message";

export interface RequestServer {
    listen(channel: ChannelLike): void
}

export function createRequestServer(work: unknown): RequestServer {
    return {
        listen(channel: ChannelLike){
            channel.addEventListener('message', async (e) => {
                const data = e.data;
                if(!isRequest(data)){
                    return;
                }
                let result: unknown;
                try{
                    // @ts-ignore
                    result = await work[data.method](...data.data);
                }catch(e){
                    const responseError: ResponseErrorMessage = {
                        type: 'responseerror',
                        requestId: data.id,
                        error: e
                    };
                    channel.postMessage(responseError);
                    return;
                }
                
                const response: ResponseMessage<unknown> = {
                    type: 'response',
                    requestId: data.id,
                    data: result
                };
                channel.postMessage(response);
            })
        }
    }
}