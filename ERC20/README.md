# Funex ETH mainnet Coin Deployment and Tests

Run the following commands to run test on the written contract with all important functions

```shell
npx hardhat test
REPORT_GAS=true npx hardhat test
```

Run the following commands to deploy to local node using hardhat

```shell
npx hardhat node
npx hardhat run scripts/deploy.js
```

Mainnet contract address of Funex Coin:
```
0xD6e460F70e1CF60E55B770f66E568B44bf3657d0
```