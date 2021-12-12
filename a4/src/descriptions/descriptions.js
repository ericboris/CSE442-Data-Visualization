const introduction = {
    title: 'Introduction',
    body: 
`Since the Bitcoin whitepaper was first published in 2008, blockchains have exploded in popularity. But what are they, how do they work, and what are they used for? 

What are blockchains? Blockchains are publically accessible, append only, distributed databases. That is, they're databases that anyone can access and contribute to but that no one can alter the history of. 

What can blockchains be used for? Many people are familiar with blockchains through cryptocurrencies where blockchains are used to maintain a ledger of transactions where, transactions like Alice sends Bob 10$, Bob sends Cathy $4, and Cathy sends Alice $9 are bundled together as data into a block and that block is linked to other blocks to form a chain - a history of transactions. But blockchains are so much more than cryptocurrencies. They have applications as varied as securing digital voting, enforcing governance, proving ownership, managing supply chains, replacing corporate hierarchies, supporting the future of a decentralized web, and much more. 

Blockchain technology is still in its infancy, but nevertheless represents the possiblity of developing a more egalitarian world of secure (I own my goods and no entity can steal them.), trustless (I don't have to trust you and you don't have to trust me since we both trust the code to treat us fairly), permissionless (Anyone can interact with the blockchain network and there are no gate keepers.), peer-to-peer (We transact direct with eachother without the intervention of middle-men.) cooperation.

That sounds good and well, but how do blockchains work? That's a huge topic and one we can't cover completely here, but we'll do our best to cover the basics.`
};

const hash = {
    title: 'Hash',
    body:
`Before we can talk about blockchains, we have to understand what a hash function is since hashing serves as the cryptographic foundation upon which blockchains function. Simply put, a hash is like a fingerprint - it uniquely identifies some data. More precisely, a hash function is a deterministic, one-way mathematical function that maps arbitrarily sized inputs to fixed sized outputs.

Yikes! Let's explain those terms.

Hashing is one way because it's fast and easy to compute the hash of some data, but it's practically impossible to figure out the data that produced a given hash. Hashing produces fixed sized outputs from arbitrary sized inputs. I.e. regardless of the amount of data that goes into a hash function, the resulting hash length will always be the same. And hashing is deterministic, the same data always produces the same hash.

In short, hashing privides easily identifiable, and impossible to reverse-engineer, fingerprints of data.`
};

const block = {
    title: 'Block',
    body:
`We now turn to the basic building block of any blockchain - a block. You'll see that it's similar to the last example except that there are a few additions.

As before, changes to the data field affect the hash, now however, changes to the block number and nonce fields also affect the hash. You'll notice that changing any of the values changes the block's color - from green to red. This is how we indicate whether the block is signed.

So what is a signed block? A signed block is a valid block, one in which any transactions can be considered valid. That is, computational work has been done to verify that a block contains valid transactional data and has the hash to prove it. This signed hash, which verifies that the block is signed, is one with a certain number of leading zeros. In the interest of computational time, we've chosen to use 4 zeros as our target for determining when a block is signed.

Computational time? Yes. We have to do work to find a signed block and that's where mining comes in. Mining is the work done to find a nonce which, when concatenated with the block's other fields, results in a signed block. Because of the unpredictability of the hash algorithm, there is no efficient algorithm for finding this nonce, so mining is essentially the process of guessing nonces until a signed hash is found.
To see this in action, change some fields in the block, turn on visualize, and click Mine! It could take some time, actually - it could take a long time, but eventually a nonce with be found and the block signed. Try it out!

Hint: Turn off visualize if you want the block to be mined faster.
Mining, or computational work, is used in some (but not all) blockchains to prevent denial of service attacks and spam against the network. It’s also used as a mechanism for reaching consensus and for adding new blocks to the chain. In the specific use of cryptocurrency blockchains like Bitcoin, mining is also how new Bitcoins are created, it's the financial reward for performing computational work.`
};

const blockchain = {
    title: 'Blockchain',
    body:
`We're finally ready to talk about blockchains.

In addition to having multiple blocks, you'll see that each block now has a an added "previous hash" field which is the hash of the previous block. The current block stores and uses the previous block's hash when computing its own hash. And that's a blockchain!

But so what? Why does referencing the previous block's hash matter? Well, for one, this linking is what turns disparate blocks into a blockchain. More significantly though, this makes blockchains tamper-proof since changes to one block require re-mining every following block.

Blockchain allows us to have an unalterable history of transactional data which makes distributed databases more secure.`
};

const distributed = {
    title: 'Distributed',
    body:
        `As we've described, blockchains are a great at resisting alterations to their history, but what's to stop someone from presenting a signed hash, and claiming to have mined a block from adding an otherwise invalid block to the chain? That's where consensus comes in.
   
    But what is consensus? That's actually quite simple, the consensus hash is the most widely agreed upon hash for the last block in the network. So, if 51% or more of the peers in the network agree on the hash for the current block, consensus is reached, and their chains are considered valid. Any chains whose hashes do not agree with the consensus are considered invalid.
    
    We illustrated this by setting a chain’s background to green if that chain agrees with the consensus, and orange otherwise.
    
    Using consensus in this way will prevents introducing invalid current blocks, since a block’s hash won't agree with the consensus even when it may be signed. This method also prevents tampering with the history of the chain, since an entirely re-mined chain's hash won't agree with the consensus either.
    
    You can see this in our example by trying to alter any chain's fields and re-mining the blocks. No matter how hard you try, you won't get a blockchain with different fields to match the other chains.`
}

const conclusion = {
    title: 'Conclusion',
    body: `This demo showed us the definitions of hash, block, blockchain, and an example of a distributed blockchain. 
    
In summary, a block's hash would change if any fields of data on that block was updated. 
And a blockchain consists of many blocks that connect with each other by storing the hash of the previous block.

We also interacted with an example of a distributed blockchain to secure transaction's history. 
This example introduced us to consensus, which means if the majority of the blockchains agree on the hash of the current block, 
consensus is reached. Any chains whose hashes do not agree with the consensus are considered invalid.

Thank you for visiting our Blockchain demo page. 

Below are some blockchain resources if you want to explore blockchain more:

Decentralized web service that uses distributed system: https://ipfs.io/
Blockchain's application in healthcare: https://builtin.com/blockchain/blockchain-healthcare-applications-companies
Blockchain's application in crypto-currency: https://www.pwc.com/us/en/industries/financial-services/fintech/bitcoin-blockchain-cryptocurrency.html 
`
}

export { introduction, hash, block, blockchain, distributed, conclusion }
