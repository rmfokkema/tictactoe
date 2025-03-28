import { createRequestServer } from '@shared/remote-communication';
import { SharedWorkImpl } from '@shared/shared-work/shared-work-impl';

const requestServer = createRequestServer(new SharedWorkImpl());

onconnect = (connectEvent) => {
    const port = connectEvent.ports[0];
    requestServer.listen(port);
    port.start();
}