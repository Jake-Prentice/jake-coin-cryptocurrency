
interface ITransaction {
    from: string;
    to: string;
    amount: number;
}

export class Transaction {
    from: string;
    to: string;
    amount: number;

    constructor({from, to, amount}: ITransaction) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}


export default Transaction;