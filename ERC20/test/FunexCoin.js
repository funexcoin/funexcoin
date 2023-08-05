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
      const { funexCoin, otherAccount } = await loadFixture(deployFunexCoin);
      await expect(funexCoin.connect(otherAccount).mint(10000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfer", function () {
    it("Direct Transfer Tokens", async function () {
      const { funexCoin, otherAccount } = await loadFixture(deployFunexCoin);
      let val = BigInt("1000000000000000000");
      await funexCoin.transfer(otherAccount.address, val);
      expect(await funexCoin.balanceOf(otherAccount.address)).to.equal(val);
    });

    it("Direct Transfer Tokens Don't have balance", async function () {
      const { funexCoin, owner, otherAccount } = await loadFixture(deployFunexCoin);
      let val = BigInt("1000000000000000000");
      await expect(funexCoin.connect(otherAccount).transfer(owner.address, val)).to.be.revertedWith("BEP20: transfer amount exceeds balance");
    });
  });

  describe("Transfer With Allowance", function () {
    it("Allowed Transfer Tokens", async function () {
      const { funexCoin, owner, otherAccount } = await loadFixture(deployFunexCoin);
      let val = BigInt("1000000000000000000");
      await funexCoin.approve(otherAccount.address, val);
      await funexCoin.connect(otherAccount).transferFrom(owner.address, otherAccount.address, val);
      expect(await funexCoin.balanceOf(otherAccount.address)).to.equal(val);
    });

    it("Allowed Transfer Tokens Don't have balance", async function () {
      const { funexCoin, owner, otherAccount } = await loadFixture(deployFunexCoin);
      let val = BigInt("1000000000000000000");
      await funexCoin.connect(otherAccount).approve(owner.address, val);
      await expect(funexCoin.transferFrom(otherAccount.address, owner.address, val)).to.be.revertedWith("BEP20: transfer amount exceeds balance");
    });

    it("Allowed Transfer Tokens Don't have allowance", async function () {
      const { funexCoin, owner, otherAccount } = await loadFixture(deployFunexCoin);
      let val = BigInt("1000000000000000000");
      await expect(funexCoin.connect(otherAccount).transferFrom(owner.address, otherAccount.address, val)).to.be.revertedWith("BEP20: transfer amount exceeds allowance");
    });
  });

  describe("Burning", function () {
    it("Should allow to burn if have balance", async function () {
      const { funexCoin, owner, otherAccount } = await loadFixture(deployFunexCoin);
      let supply = BigInt("50000000000000000000000000");
      let val = BigInt("1000000000000000000");
      await funexCoin.burn(val);
      expect(await funexCoin.balanceOf(owner.address)).to.equal(supply - val);
    });

    it("Should not allow burn without balance", async function () {
      const { funexCoin, otherAccount } = await loadFixture(deployFunexCoin);
      let val = BigInt("1000000000000000000");
      await expect(funexCoin.connect(otherAccount).burn(val)).to.be.revertedWith("BEP20: burn amount exceeds balance");
    });
  });

});