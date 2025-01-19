import { Theme } from "../src/scripts/themes";

export class MockTheme implements Theme {
    public constructor(
        private id = ''
    ){

    }
    public backgroundColor = '#fff';
    public color = '#000'
    public get winnerTheme(){return new MockTheme(`${this.id}+`)}
    public get loserTheme(){return new MockTheme(`${this.id}-`)}
    public toString(){
        return this.id;
    }
}