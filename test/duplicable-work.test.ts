import { type AsyncWork, duplicableWork } from '@shared/remote-communication';
import { describe, it, expect, beforeAll, vi, type Mock } from 'vitest'
import { MockBroadcastChannel } from './mock-broadcast-channel';

vi.useFakeTimers();

const duplicationRequestTimeout = 100;

interface TestDuplicableWorkState {
    value: number
}
interface TestDuplicableWork {
    doFoo(input: number): void
    getBar(): number
}
interface TestAsyncWork {
    work: AsyncWork<TestDuplicableWork>
    state: TestDuplicableWorkState
    channel: MockBroadcastChannel
    doFooMock: Mock<(input: number) => void>
    getBarMock: Mock<() => number>
}

describe('duplicable work', () => {
    let testWork: TestAsyncWork;
    let secondTestWork: TestAsyncWork;

    beforeAll(() => {
        testWork = createTestAsyncWork();
    })

    describe('when a command is sent', () => {
        const doFooInput = 6;
        let doFooPromise: Promise<void>;


        beforeAll(() => {
            doFooPromise = testWork.work.doFoo(doFooInput);
        })

        it('should have asked for the state', () => {
            expect(testWork.channel.messageMock).toHaveBeenCalledWith({
                data: [],
                id: expect.any(String),
                method: 'getState',
                type: 'request'
            });
        })

        describe('and then the timeout expires because there is no other instance', () => {

            beforeAll(() => {
                vi.advanceTimersByTime(duplicationRequestTimeout)
            })

            it('should have executed the command', async () => {
                await doFooPromise;
                expect(testWork.doFooMock).toHaveBeenCalledWith(doFooInput)
            })
        })
    });

    it('should execute another command without waiting for anything', async () => {
        const secondInput = 7;
        await testWork.work.doFoo(secondInput);
        expect(testWork.doFooMock).toHaveBeenCalledWith(secondInput)
    })

    describe('and then there is a second instance', () => {
        
        beforeAll(() => {
            secondTestWork = createTestAsyncWork();
        })

        describe('and a query is sent to it', () => {
            let getBarPromise: Promise<number>;

            beforeAll(() => {
                getBarPromise = secondTestWork.work.getBar();
            })

            it('should have asked for the state', () => {
                expect(secondTestWork.channel.messageMock).toHaveBeenCalledWith({
                    data: [],
                    id: expect.any(String),
                    method: 'getState',
                    type: 'request'
                });
            })

            describe('and then the message is passed on', () => {

                beforeAll(() => {
                    testWork.state = { value: testWork.state.value + 1};
                    const [message] = secondTestWork.channel.messageMock.mock.calls[0];
                    testWork.channel.messageHandler({
                        data: message
                    } as MessageEvent);
                })

                it('should get an answer', async () => {
                    expect(testWork.channel.messageMock).toHaveBeenCalledTimes(2);
                    const [responseMessage] = testWork.channel.messageMock.mock.calls[1];
                    secondTestWork.channel.messageHandler({
                        data: responseMessage
                    } as MessageEvent);
                    await getBarPromise;
                    expect(secondTestWork.getBarMock).toHaveBeenCalled();
                    expect(secondTestWork.state).toEqual(testWork.state)
                })
            })
        })
    })

    describe('and then another command is sent to the first', () => {
        let doFooPromise: Promise<void>

        beforeAll(() => {
            testWork.state = { value: testWork.state.value + 1};
            doFooPromise = testWork.work.doFoo(9);
        })

        it('should have sent a request to update the state', () => {
            expect(testWork.channel.messageMock).toHaveBeenCalledTimes(3);
        })

        describe('and then the message is passed on', () => {

            beforeAll(() => {
                const [updateStateRequest] = testWork.channel.messageMock.mock.calls[2];
                secondTestWork.channel.messageHandler({data: updateStateRequest} as MessageEvent);
            })

            it('the state should have been updated and a response sent back', () => {
                expect(secondTestWork.state).toEqual(testWork.state);
                expect(secondTestWork.channel.messageMock).toHaveBeenCalledTimes(2);
            })

            it('should finish', async () => {
                const [updateStateResponse] = secondTestWork.channel.messageMock.mock.calls[1];
                testWork.channel.messageHandler({data: updateStateResponse} as MessageEvent);
                await doFooPromise;
            })
        })
    })
})

function createTestAsyncWork(): TestAsyncWork{
    const channel = new MockBroadcastChannel();
    const doFooMock = vi.fn();
    const getBarMock = vi.fn();
    let state = { value: 5 };
    const work = duplicableWork({
        doFoo: doFooMock,
        getBar: getBarMock,
        getState() {
            return state;
        },
        setState(value){
            state = value
        }
    }).create(
        channel,
        duplicationRequestTimeout,
        {
            commands: ['doFoo'],
            queries: ['getBar']
        }
    )
    return {
        work,
        get state(){return state;},
        set state(value){state = value;},
        channel,
        doFooMock,
        getBarMock
    }
}