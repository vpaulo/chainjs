// https://dev.to/freakcdev297/creating-a-blockchain-in-60-lines-of-javascript-5fka
// https://www.youtube.com/watch?v=zVqczFZr124
// https://www.youtube.com/watch?v=HneatE69814
const {
    createHash
  } = await import('crypto');
const SHA256 = message => createHash('sha256').update(message).digest('hex');

export class Block {
    constructor(data = [], timestamp = Date.now().toString()) {
        this.timestamp = timestamp;
        this.data = data;
        this.prevHash = '';
        this.hash = this.getHash();
        this.nonce = 0;
    }

    getHash() {
        return SHA256(this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce);
    }

    mine(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.getHash();
        }
    }
}

export class Blockchain {
    constructor() {
        this.chain = [new Block()]; // Genesis block
        this.difficulty = 1;
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.prevHash = this.getLastBlock().hash;
        block.hash = block.getHash();
        block.mine(this.difficulty);
        this.chain.push(block);
    }

    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if (currentBlock.hash !== currentBlock.getHash() || prevBlock.hash !== currentBlock.prevHash) {
                return false;
            }
        }

        return true;
    }
}

export const MyChain = new Blockchain();
