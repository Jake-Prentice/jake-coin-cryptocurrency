import BlockChain, {Block, Transaction} from "./blockChain"; 
import {ec as EC} from "elliptic";

// const public = "048e6e44e63e5bc69f1b7ab904eb99da83d73f36f8e6a906ed991d5568c9768c30cdb3985fb97c1bc65486fb5ae8a6bd540904482328131993a08290a1018cdd4b"
const ec = new EC("secp256k1");

const privateKey = ec.keyFromPrivate("5de5c4650dc0ff0bfcc3fa91b1f089cc448857951b98d0a17a92bc3876875f0b")
const myWallet = privateKey.getPublic("hex");

// const key = ec.genKeyPair()

const jakeCoin = new BlockChain({
    blockMaxSize: 2,
    difficulty: 4,
    miningReward: 5
});

const t1 = new Transaction({
    from: null,
    to: myWallet,
    amount: 100
})


jakeCoin.addTransaction(t1)
jakeCoin.minePendingTransactions(myWallet, [0])

console.log(`balance: ${jakeCoin.getCurrentBalanceOfAddress(myWallet)} (jake coin)`)

// jakeCoin.blockChain[1].transactions[0].amount = 1000

console.log("pending transactions: ",jakeCoin.pendingTransactions);

console.log("is block chain valid: " + jakeCoin.isBlockChainValid())



