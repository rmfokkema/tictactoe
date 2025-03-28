import type { AsyncWork } from "./async-work";
import type { ChannelLike } from "./channel-like";
import type { DuplicableWork } from "./duplicable-work";
import type { MethodArgs, MethodKey, MethodReturnType } from "./method-key";
import { remoteClient } from "./remote-client";
import { RemoteTimeoutError } from "./remote-timeout-error";
import { createRequestServer } from "./request-server";

interface DuplicableWorkFactory<TWork> {
    create<TCommands extends readonly MethodKey<TWork>[], TQueries extends readonly MethodKey<TWork>[]>(
        duplicationChannel: ChannelLike,
        duplicationRequestTimeout: number,
        methods: {
            commands: TCommands
            queries: TQueries 
        }
    ): AsyncWork<Pick<TWork, TCommands[number] | TQueries[number]>>
}

export function duplicableWork<TWork, TWorkState>(
    work: TWork & DuplicableWork<TWorkState>
): DuplicableWorkFactory<TWork> {
    return {
        create(
            duplicationChannel,
            duplicationRequestTimeout,
            { commands, queries }
        ){
            const duplicationClient = remoteClient<DuplicableWork<TWorkState>>().create(
                duplicationChannel,
                ['getState', 'setState'],
                duplicationRequestTimeout
            );
            const methods: Partial<AsyncWork<TWork>> = {};
            let alone = true;
            let initialized = false;
            for(const queryName of queries){
                // @ts-ignore
                methods[queryName] = createQuery(queryName)
            }

            for(const commandName of commands){
                // @ts-ignore
                methods[commandName] = createCommand(commandName);
            }
            const proxy: DuplicableWork<TWorkState> = {
                getState(){
                    alone = false;
                    return work.getState();
                },
                setState(value){
                    work.setState(value)
                }
            }
            createRequestServer(proxy).listen(duplicationChannel);

            return methods as AsyncWork<TWork>;

            function createQuery<TMethod extends MethodKey<TWork>>(method: TMethod){
                return async (...args: MethodArgs<TWork, TMethod>) => {
                    await ensureInitialized();
                    return (work[method] as (...args:  MethodArgs<TWork, TMethod>) => MethodReturnType<TWork, TMethod>)(...args);
                }
            }

            function createCommand<TMethod extends MethodKey<TWork>>(method: TMethod){
                return async (...args: MethodArgs<TWork, TMethod>) => {
                    await ensureInitialized();
                    const result = (work[method] as (...args:  MethodArgs<TWork, TMethod>) => MethodReturnType<TWork, TMethod>)(...args);
                    if(alone){
                        return result;
                    }
                    try{
                        await duplicationClient.setState(work.getState());
                        return result;
                    }catch(e){
                        if(e instanceof RemoteTimeoutError){
                            alone = true;
                            return result;
                        }
                        throw new Error('could not duplicate state', {cause: e});
                    }
                }
            }

            async function ensureInitialized(): Promise<void> {
                if(initialized){
                    return;
                }
                try{
                    const state = await duplicationClient.getState();
                    work.setState(state);
                    alone = false;
                }catch(e){
                    if(e instanceof RemoteTimeoutError){
                        return;
                    }
                    throw new Error('could not get duplicated state', {cause: e});
                }finally{
                    initialized = true;
                }
            }


        }
    }
}