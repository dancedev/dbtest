import {RxDatabase} from "rxdb";

export class Context {
    value: number;
    db: RxDatabase;
    message: string;

    lastObj: any;

    randomize() {
        return Math.floor(Math.random() * 100);
    }

    constructor(value: number) {
        this.value = value;
    }
}
