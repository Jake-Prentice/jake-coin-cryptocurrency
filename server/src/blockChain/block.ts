import crypto from "crypto";
import Transaction from "./transaction";

interface IBlock {
    previousHash: string;
    transactions?: Transaction[];
}

class Block {

    previousHash: string;
    transactions: Transaction[];
    nonce = 0;
    readonly timestamp = new Date().toLocaleString().split(",")[0]; 
    hash: string;

    constructor({previousHash, transactions=[]}: IBlock) {
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.hash = this.computeHash()
    }

    computeHash(): string {
        return crypto.createHash("sha256").update(
            this.previousHash +
            JSON.stringify(this.transactions) +
            this.nonce +
            this.timestamp
        ).digest("hex");
    }

    mine(difficulty: number): void {

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++
            this.hash = this.computeHash()
            if (this.nonce % 100 === 0) {
                const status = (this.hash.slice(0,difficulty).match(/0/g) || []).length;
                console.log(`loading ${this.nonce}, status: ${status}/${difficulty}`)
            }
        }

        console.log(`mine complete with nonce: ${this.nonce} and hash: ${this.hash}`)
    }
}

export default Block;