import BlockChain, {Block, Transaction} from "./blockChain"; 

const jakeCoin = new BlockChain({
    blockMaxSize: 2,
    difficulty: 4
});

jakeCoin.addTransaction({
    from: "jake",
    to: "rexy",
    amount: 100
})

jakeCoin.addTransaction({
    from: "jake",
    to: "rexy",
    amount: 200
})


jakeCoin.minePendingTransactions([0,1])

jakeCoin.blockChain[1].transactions[0].amount = 1000

console.log(jakeCoin.isBlockChainValid())