# Funex BSC Coin Deployment and Tests

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
0xa07c39f8df11ca675f77efc19501e3dddacd03ed
```