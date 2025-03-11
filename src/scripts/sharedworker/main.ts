import { isRequest } from '@shared/sharedworker/worker-message'
import { createRequestServer } from './request-server';
import { SharedWorkImpl } from './shared-work-impl';

const requestServer = createRequestServer(new SharedWorkImpl());

onconnect = (connectEvent) => {
    const port = connectEvent.ports[0];
    port.onmessage = (e) => {
        const data = e.data;
        if(isRequest(data)){
            port.postMessage(requestServer.getReponse(data))
        }
    }
}