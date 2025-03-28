import { vi } from 'vitest'

export class MockBroadcastChannel implements BroadcastChannel {
    private readonly messageHandlers: ((ev: MessageEvent) => void)[] = [];
    public name: string = 'test'
    public messageHandler(e: MessageEvent): void{
        for(const handler of this.messageHandlers){
            handler(e)
        }
    };
    public messageMock = vi.fn();
    public set onmessage(value: (e: MessageEvent) => void){
        this.messageHandlers.splice(0, this.messageHandlers.length);
        this.messageHandlers.push(value);
    }
    public get onmessage(): (e: MessageEvent) => void {
        return this.messageHandler.bind(this);
    }
    public onmessageerror = () => {}
    public close(){}
    public addEventListener<K extends keyof BroadcastChannelEventMap>(type: K, listener: (ev: BroadcastChannelEventMap[K]) => void): void {
        if(type === 'message'){
            this.messageHandlers.push(listener);
        }
    }
    public removeEventListener(): void {
        
    }
    public postMessage(message: any): void {
        this.messageMock(message);
    }
    public dispatchEvent(): boolean {
        return false;
    }
}