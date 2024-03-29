# TRC20 token deployed for Funex

This repository contains all details required to deploy the Funex contract which is currently deployed to the TRON blockchain on the following address

TRON Address of Funex:

```
TMYBRDphyekK3JR31RuthpUx6N8Qcj6Wao
```

## Testing the token contract

Below are mentioned versions of tronbox, tron runtime environment and other libraries or tools used to test the contracts.

```shell
tronbox --version
TronBox: v3.4.0
Solidity: v0.8.18

node --version
v20.3.0

npm --version
9.8.1
```

Below are the commands to run the tests
(Please note that you'll need to install tronbox and tron runtime environment)

```shell
docker run -it \
-p 9090:9090 \
--rm \
--name tron \
tronbox/tre

tronbox complie

tronbox test test/FunexTest.js
```

## Deploying the token contract

Below are the command you can run to deploy the contracts to any network. (Please note that you'll need to install tronbox and tron runtime environment)

Before running the commands you need to set enviorment variable for this same commands and deployment to nile network you need to set `PRIVATE_KEY_NILE` to your own private key with TRX over nile network so that it can be deployed.

```shell
tronbox complie

tronbox migrate --netwok nile
```
