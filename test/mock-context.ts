export interface ContextMock{
    ctx: CanvasRenderingContext2D
    record: string[]
    reset(): void
}

function createMockObj(record: string[]): unknown{
    const methods: string[] = ['beginPath', 'moveTo', 'lineTo', 'stroke', 'save', 'restore',
        'fillRect'
    ];
    const setters: string[] = ['strokeStyle', 'lineWidth', 'fillStyle']
    const result: unknown = {};
    for(const methodName of methods){
        result[methodName] = (...args: unknown[]) => {
            const params = args.map(a => JSON.stringify(a)).join(', ');
            record.push(`ctx.${methodName}(${params});`)
        }
    }
    for(const setterName of setters){
        Object.defineProperty(result, setterName, {
            enumerable: true,
            set: (value: unknown) => {
                record.push(`ctx.${setterName} = ${JSON.stringify(value)}`)
            }
        });
    }
    return result;
}

export function mockContext(): ContextMock{
    const record: string[] = [];
    const mockObj = createMockObj(record);
    return {
        ctx: mockObj as CanvasRenderingContext2D,
        record,
        reset
    }
    function reset(): void{
        record.splice(0)
    }
}