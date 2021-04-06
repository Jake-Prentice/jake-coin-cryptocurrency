import Block from "./block";
import Transaction from "./transaction";
import {ec as EC} from "elliptic";

interface IBlockChain {
    difficulty?: number;
    blockMaxSize?: number;
    miningReward?: number;
}

class BlockChain {

    blockChain: Block[] = [this.createGenesisBlock()];
    pendingTransactions: Transaction[] = []
    blockMaxSize: number;
    difficulty: number;
    miningReward: number;

    constructor({difficulty=4, blockMaxSize=10, miningReward=5}: IBlockChain) {
        this.difficulty = difficulty;
        this.blockMaxSize = blockMaxSize;
        this.miningReward = miningReward; 
    }

    createGenesisBlock() : Block {
        return new Block({previousHash: "0"});
    }

    getLatestBlock(): Block {
        return this.blockChain[this.blockChain.length - 1];
    }

    addTransaction(transaction: Transaction) {
        if (transaction.amount <= 0 ) {
            throw new Error("transaction must be greater than 0!");
        }

        //allow the first transaction to cheat the system
        if (this.blockChain.length > 1 && 
            this.getCurrentBalanceOfAddress(transaction.from!) < transaction.amount
        ) {
            throw new Error("you don't have enough to  make this transaction!")
        }

        if (!transaction.isValid()) {
            throw new Error("transaction isn't valid!");
        }

        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(minersAddress: string, [from=0, to=from]: number[]) {

        if (this.pendingTransactions.length < to) {
            throw new Error("to, exceeds transaction pools current size!")
        }
     
        if (to - from > this.blockMaxSize) {
            throw new Error(`a block can only have: ${this.blockMaxSize} transactions!`)
        }

        const newBlock = new Block({previousHash: this.getLatestBlock().hash});
        newBlock.transactions.push(new Transaction({
            from: null,
            to: minersAddress,
            amount: this.miningReward
        }))
        
        for (let i=from; i <= to; i++) {
            newBlock.transactions.push(this.pendingTransactions[i]);
        }

        newBlock.mine(this.difficulty);
        this.blockChain.push(newBlock);

        this.pendingTransactions = this.pendingTransactions.filter((_, i) => !(i >= from && i <= to))
            
        
    }

    isBlockChainValid(): boolean {
        for (let i=1; i < this.blockChain.length; i++) {
            const currentBlock = this.blockChain[i];
            const previousBlock = this.blockChain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) return false;
            if (currentBlock.hash !== currentBlock.computeHash()) return false;
        }
        return true;
    }

    getCurrentBalanceOfAddress(address: string) {
        let balance = 0;
        //ignore genesis block
        for (let i=1; i < this.blockChain.length; i++) {
            this.blockChain[i].transactions.forEach(transaction => {
                if (transaction.from === address) balance -= transaction.amount;
                else if (transaction.to === address) balance += transaction.amount;
            })
        }

        return balance;
    }
}

export default BlockChain;
export { Block, Transaction }







