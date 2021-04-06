import {ec as EC} from "elliptic";
import crypto from "crypto";
import BlockChain from "./index";

interface ITransaction {
    from: string | null;
    to: string;
    amount: number;
}

export class Transaction {
    from: string | null;
    to: string;
    amount: number;
    signature: string = "";

    constructor({from, to, amount}: ITransaction) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }

    calculateHash() {
        return crypto.createHash("sha256").update(
            this.from +
            this.to +
            this.amount
        ).digest("hex");
    }

    sign(keyPair: EC.KeyPair) {
        if (keyPair.getPublic("hex") !== this.from) {
            throw new Error("you can only sign from your own wallet!")
        }

        const hashedTransaction = this.calculateHash();
        const signature = keyPair.sign(hashedTransaction)
        this.signature = signature.toDER("hex");
    }

    isValid() {

        if (!this.signature && this.from !== null) return false;

        // const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        // return publicKey.verify(this.calculateHash(), this.signature);
        return true;
    }
}


export default Transaction;