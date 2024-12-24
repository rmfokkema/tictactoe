import crypto from 'crypto'

export interface ContextMock{
    ctx: CanvasRenderingContext2D
    getRecord(): string
    reset(): void
}

function createMockObj(record: {text: string}): unknown{
    const methods: string[] = ['beginPath', 'moveTo', 'lineTo', 'stroke', 'save', 'restore',
        'fillRect', 'clearRect', 'arc'
    ];
    const setters: string[] = ['strokeStyle', 'lineWidth', 'fillStyle']
    const result: unknown = {};
    for(const methodName of methods){
        result[methodName] = (...args: unknown[]) => {
            const params = args.map(a => stringifyValue(a)).join(', ');
            record.text += `ctx.${methodName}(${params});`
        }
    }
    for(const setterName of setters){
        Object.defineProperty(result, setterName, {
            enumerable: true,
            set: (value: unknown) => {
                record.text += `ctx.${setterName} = ${stringifyValue(value)};`
            }
        });
    }
    function stringifyValue(value: unknown): string {
        if(value === Infinity){
            return 'Infinity';
        }
        if(value === -Infinity){
            return '-Infinity';
        }
        return JSON.stringify(value);
    }
    return result;
}

export function mockContext(): ContextMock{
    const record: {text: string} = {text: ''};
    const mockObj = createMockObj(record);
    return {
        ctx: mockObj as CanvasRenderingContext2D,
        getRecord(){
            return crypto.createHash('md5').update(record.text).digest("hex")
        },
        reset
    }
    function reset(): void{
        record.text = '';
    }
}