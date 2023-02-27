# TickeDapp

Decentralized application that works on blockchain and enables creating and trading tickets for events. The application is also intended to create a marketplace for users to ensure safe trading between untrusted users. Tickets are represented by tokens with metadata that covers all relevant information about event. Properties of tokens are provided in standard way to allow external services (ex. OpenSea) to properly display metadata. The application has been tested with unit tests and also some audits were carried out to reduce the risk of vulnerabilities in smartcontracts.

# Related technologies:
- Angular - frontend (Typescript) [[DOC]](/documentation)
- Solidity - smart contracts [[DOC]](/documentation-solidity/index.md)
- Hardhat - local deploy, unit tests
- Slither - audit
- Ethereum (EVM) - Goerli Testnet
- NFT / SFT - OpenZeppelin ERC1155
- Metamask - crypto wallet

# Architecture
![Schema](/assets/architecture-on-off-chain.svg)
This simple schema shows which part of application is deployed on chain (where all data is stored) and the second part - web application. 
Reading data from blockchain is free but if user wants to changes the state of blockchain (to add sth to it, or even buy a ticket) it has to make a transaction and pay gas for it. 
* Transactions are marked as orange arrows and specify with which smart contract is user interacting while performing main use cases
* Smart contracts shares some data to minimaze costs of transactions
* There are two main smart contracts - tickeDFactory (creates new tickeD1155 for each event) and nftMarketplace (holds users offers and enable trading) 
* Each concert is represented by different smart contract tickeD1155, which means that each concert has a different NFT/SFT collection


## Generated smart contracts class diagram
![Class diagram](/assets/classDiagram.svg)


# How to run
//todo
### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. 
### Running unit tests
Run `npx hardhat test`
### Documentation
Angular - Compodoc: `npm run compodoc`
Solidity - OpenZeppelin/solidity-docgen: `npx hardhat docgen`

