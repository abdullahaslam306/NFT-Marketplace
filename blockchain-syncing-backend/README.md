# Blocommerce Blockchain Syncing

Contains API implmentation for management of Blockchain syncing process


Environment Variables:



Batch identifer is a uuid which unique for the whole syncing process that includes following steps
- Owned Nft Syncing
- Transaction Syncing
- Historical NFT Syncing
 Each of this step in the workflow will create an independent row in blockchain_sync table