const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Funex", function () {
  async function deployFunex() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Funex = await ethers.getContractFactory("Funex");
    const funex = await Funex.deploy();

    return { funex, owner, otherAccount };
  }

  describe("Deployment", function () {

    it("Should set the right owner", async function () {
      const { funex, owner } = await loadFixture(deployFunex);
      expect(await funex.getOwner()).to.equal(owner.address);
    });

    let _name = "Funex";
    let _symbol = "Funex";
    let _decimals = 18;
    let _totalSupply = BigInt("50000000000000000000000000");

    it("Should set all parameters correctly", async function () {
      const { funex } = await loadFixture(deployFunex);
      expect(await funex.name()).to.equal(_name);
      expect(await funex.symbol()).to.equal(_symbol);
      expect(await funex.decimals()).to.equal(_decimals);
      expect(await funex.totalSupply()).to.equal(_totalSupply);
    })

  });

  describe("Minting", function () {
    it("Should allow owner to mint", async function () {
      const { funex, owner } = await loadFixture(deployFunex);
      let bal = await funex.balanceOf(owner.address);
      await funex.mint(1000000);
      expect(await funex.balanceOf(owner.address)).to.equal(bal + BigInt(1000000));
    });

    it("Should not allow others to mint", async function () {
      const { funex, otherAccount } = await loadFixture(deployFunex);
      await expect(funex.connect(otherAccount).mint(10000)).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Transfer", function () {
    it("Direct Transfer Tokens", async function () {
      const { funex, otherAccount } = await loadFixture(deployFunex);
      let val = BigInt("1000000000000000000");
      await funex.transfer(otherAccount.address, val);
      expect(await funex.balanceOf(otherAccount.address)).to.equal(val);
    });

    it("Direct Transfer Tokens Don't have balance", async function () {
      const { funex, owner, otherAccount } = await loadFixture(deployFunex);
      let val = BigInt("1000000000000000000");
      await expect(funex.connect(otherAccount).transfer(owner.address, val)).to.be.revertedWith("BEP20: transfer amount exceeds balance");
    });
  });

  describe("Transfer With Allowance", function () {
    it("Allowed Transfer Tokens", async function () {
      const { funex, owner, otherAccount } = await loadFixture(deployFunex);
      let val = BigInt("1000000000000000000");
      await funex.approve(otherAccount.address, val);
      await funex.connect(otherAccount).transferFrom(owner.address, otherAccount.address, val);
      expect(await funex.balanceOf(otherAccount.address)).to.equal(val);
    });

    it("Allowed Transfer Tokens Don't have balance", async function () {
      const { funex, owner, otherAccount } = await loadFixture(deployFunex);
      let val = BigInt("1000000000000000000");
      await funex.connect(otherAccount).approve(owner.address, val);
      await expect(funex.transferFrom(otherAccount.address, owner.address, val)).to.be.revertedWith("BEP20: transfer amount exceeds balance");
    });

    it("Allowed Transfer Tokens Don't have allowance", async function () {
      const { funex, owner, otherAccount } = await loadFixture(deployFunex);
      let val = BigInt("1000000000000000000");
      await expect(funex.connect(otherAccount).transferFrom(owner.address, otherAccount.address, val)).to.be.revertedWith("BEP20: transfer amount exceeds allowance");
    });
  });

  describe("Burning", function () {
    it("Should allow to burn if have balance", async function () {
      const { funex, owner, otherAccount } = await loadFixture(deployFunex);
      let supply = BigInt("50000000000000000000000000");
      let val = BigInt("1000000000000000000");
      await funex.burn(val);
      expect(await funex.balanceOf(owner.address)).to.equal(supply - val);
    });

    it("Should not allow burn without balance", async function () {
      const { funex, otherAccount } = await loadFixture(deployFunex);
      let val = BigInt("1000000000000000000");
      await expect(funex.connect(otherAccount).burn(val)).to.be.revertedWith("BEP20: burn amount exceeds balance");
    });
  });

});