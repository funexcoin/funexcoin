const hre = require("hardhat");

async function main() {

  const FunexCoin = await hre.ethers.deployContract("FunexCoin");

  await FunexCoin.waitForDeployment();

  console.log(
    `FunexCoin deployed to ${FunexCoin.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
