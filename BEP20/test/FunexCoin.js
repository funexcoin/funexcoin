const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("FunexCoin", function () {
  async function deployFunexCoin() {
    const [owner, otherAccount] = await ethers.getSigners();

    const FunexCoin = await ethers.getContractFactory("FunexCoin");
    const funexCoin = await FunexCoin.deploy();

    return { funexCoin, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { funexCoin, owner } = await loadFixture(deployFunexCoin);
      expect(await funexCoin.getOwner()).to.equal(owner.address);
    });

    let _name = "FunexCoin";
    let _symbol = "Funex";
    let _decimals = 18;
    let _totalSupply = BigInt("50000000000000000000000000");

    it("Should set all parameters correctly", async function () {
      const { funexCoin } = await loadFixture(deployFunexCoin);
      expect(await funexCoin.name()).to.equal(_name);
      expect(await funexCoin.symbol()).to.equal(_symbol);
      expect(await funexCoin.decimals()).to.equal(_decimals);
      expect(await funexCoin.totalSupply()).to.equal(_totalSupply);
    })

  });

  describe("Minting", function () {
    it("Should allow owner to mint", async function () {
      const { funexCoin, owner } = await loadFixture(deployFunexCoin);
      let bal = await funexCoin.balanceOf(owner.address);
      await funexCoin.mint(1000000);
      expect(await funexCoin.balanceOf(owner.address)).to.equal(bal + BigInt(1000000));
    });

    it("Should not allow others to mint", async function () {
      const { funexCoin, owner, otherAccount } = await loadFixture(deployFunexCoin);
      await expect(funexCoin.connect(otherAccount).mint(10000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfer", function () {
    it("Transfer if you have money")
  })

});