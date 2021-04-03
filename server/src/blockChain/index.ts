import Block from "./block";
import Transaction from "./transaction";

interface IBlockChain {
    difficulty?: number;
    blockMaxSize?: number;
}

class BlockChain {

    blockChain: Block[] = [this.createGenesisBlock()];
    pendingTransactions: Transaction[] = []
    blockMaxSize: number;
    difficulty: number;

    constructor({difficulty=4, blockMaxSize=10}: IBlockChain) {
        this.difficulty = difficulty;
        this.blockMaxSize = blockMaxSize;
    }

    createGenesisBlock() : Block {
        return new Block({previousHash: "0"});
    }

    getLatestBlock(): Block {
        return this.blockChain[this.blockChain.length - 1];
    }

    addTransaction(transaction: Transaction) {
        //TODO VALIDATION
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions([from=0, to=from]: number[]) {    
        if (this.pendingTransactions.length < to) {
            throw new Error("to, exceeds transaction pools current size!")
        }
     
        if (to - from > this.blockMaxSize) {
            throw new Error(`a block can only have: ${this.blockMaxSize} transactions!`)
        }

        const newBlock = new Block({previousHash: this.getLatestBlock().hash});
        
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
}

export default BlockChain;
export { Block, Transaction }







