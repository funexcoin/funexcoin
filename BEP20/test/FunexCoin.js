const {
	loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { constants, expectRevert } = require("@openzeppelin/test-helpers");

describe("FunexCoin", function () {
	async function deployFunexCoin() {
		const [owner, otherAccount] = await ethers.getSigners();

		const FunexCoin = await ethers.getContractFactory("Funex");
		const funexCoin = await FunexCoin.deploy();

		return { funexCoin, owner, otherAccount };
	}

	describe("Deployment", function () {
		it("Should set the right owner", async function () {
			const { funexCoin, owner } = await loadFixture(deployFunexCoin);
			expect(await funexCoin.getOwner()).to.equal(owner.address);
		});

		let _name = "Funex";
		let _symbol = "Funex";
		let _decimals = 18;
		let _totalSupply = BigInt("50000000000000000000000000");

		it("Should set all parameters correctly", async function () {
			const { funexCoin } = await loadFixture(deployFunexCoin);
			expect(await funexCoin.name()).to.equal(_name);
			expect(await funexCoin.symbol()).to.equal(_symbol);
			expect(await funexCoin.decimals()).to.equal(_decimals);
			expect(await funexCoin.totalSupply()).to.equal(_totalSupply);
		});
	});

	describe("Transfer Ownership", function () {
		it("Should allow owner to transfer ownership", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			await funexCoin.transferOwnership(otherAccount.address);
			expect(await funexCoin.getOwner()).to.equal(otherAccount.address);
		});

		it("Should not allow others to transfer ownership", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			await expect(
				funexCoin.connect(otherAccount).transferOwnership(owner.address)
			).to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("Should not allow to transfer ownership to zero address", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			await expect(
				funexCoin.transferOwnership(constants.ZERO_ADDRESS)
			).to.be.revertedWith("Ownable: new owner is the zero address");
		});

		it("Renounce Ownership", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);

			await funexCoin.renounceOwnership();
			expect(await funexCoin.getOwner()).to.equal(constants.ZERO_ADDRESS);
		});

		it("Should not allow others to renounce ownership", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);

			await expect(
				funexCoin.connect(otherAccount).renounceOwnership()
			).to.be.revertedWith("Ownable: caller is not the owner");

			expect(await funexCoin.getOwner()).to.equal(owner.address);
		});
	});

	describe("Minting", function () {
		it("Should allow owner to mint", async function () {
			const { funexCoin, owner } = await loadFixture(deployFunexCoin);
			let bal = await funexCoin.balanceOf(owner.address);
			await funexCoin.mint(1000000);
			expect(await funexCoin.balanceOf(owner.address)).to.equal(
				bal + BigInt(1000000)
			);
			await expect(
				funexCoin.mint(BigInt(constants.MAX_UINT256))
			).to.be.revertedWith("SafeMath: addition overflow");
		});

		it("Should not allow others to mint", async function () {
			const { funexCoin, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			await expect(
				funexCoin.connect(otherAccount).mint(10000)
			).to.be.revertedWith("Ownable: caller is not the owner");
		});
	});

	describe("Transfer", function () {
		it("Direct Transfer Tokens", async function () {
			const { funexCoin, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await funexCoin.transfer(otherAccount.address, val);
			await expect(
				funexCoin.transfer(constants.ZERO_ADDRESS, val)
			).to.be.revertedWith("BEP20: transfer to the zero address");
			expect(await funexCoin.balanceOf(otherAccount.address)).to.equal(
				val
			);
		});

		it("Direct Transfer Tokens Don't have balance", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await expect(
				funexCoin.connect(otherAccount).transfer(owner.address, val)
			).to.be.revertedWith("BEP20: transfer amount exceeds balance");
		});
	});

	describe("Transfer With Allowance", function () {
		it("Allowed Transfer Tokens", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await expect(
				funexCoin.approve(constants.ZERO_ADDRESS, val)
			).to.be.revertedWith("BEP20: approve to the zero address");
			await funexCoin.approve(otherAccount.address, val);
			await expect(
				funexCoin
					.connect(otherAccount)
					.transferFrom(owner.address, constants.ZERO_ADDRESS, val)
			).to.be.revertedWith("BEP20: transfer to the zero address");
			await expect(
				funexCoin
					.connect(otherAccount)
					.transferFrom(constants.ZERO_ADDRESS, owner.address, val)
			).to.be.revertedWith("BEP20: transfer from the zero address");
			await funexCoin
				.connect(otherAccount)
				.transferFrom(owner.address, otherAccount.address, val);
			expect(await funexCoin.balanceOf(otherAccount.address)).to.equal(
				val
			);
		});

		it("Check Allowance", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await funexCoin.approve(otherAccount.address, val);
			expect(
				await funexCoin.allowance(owner.address, otherAccount.address)
			).to.equal(val);

			await funexCoin.increaseAllowance(otherAccount.address, val);
			expect(
				await funexCoin.allowance(owner.address, otherAccount.address)
			).to.equal(val + val);

			await funexCoin.decreaseAllowance(otherAccount.address, val);
			expect(
				await funexCoin.allowance(owner.address, otherAccount.address)
			).to.equal(val);

			await funexCoin.decreaseAllowance(otherAccount.address, val);
			expect(
				await funexCoin.allowance(owner.address, otherAccount.address)
			).to.equal(0);

			await expect(
				funexCoin.decreaseAllowance(otherAccount.address, val)
			).to.be.revertedWith("BEP20: decreased allowance below zero");
		});

		it("Allowed Transfer Tokens Don't have balance", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await funexCoin.connect(otherAccount).approve(owner.address, val);
			await expect(
				funexCoin.transferFrom(otherAccount.address, owner.address, val)
			).to.be.revertedWith("BEP20: transfer amount exceeds balance");
		});

		it("Allowed Transfer Tokens Don't have allowance", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await expect(
				funexCoin
					.connect(otherAccount)
					.transferFrom(owner.address, otherAccount.address, val)
			).to.be.revertedWith("BEP20: transfer amount exceeds allowance");
		});
	});

	describe("Burning", function () {
		it("Should allow to burn if have balance", async function () {
			const { funexCoin, owner, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let supply = BigInt("50000000000000000000000000");
			let val = BigInt("1000000000000000000");
			await funexCoin.burn(val);
			expect(await funexCoin.balanceOf(owner.address)).to.equal(
				supply - val
			);
		});

		it("Should not allow burn without balance", async function () {
			const { funexCoin, otherAccount } = await loadFixture(
				deployFunexCoin
			);
			let val = BigInt("1000000000000000000");
			await expect(
				funexCoin.connect(otherAccount).burn(val)
			).to.be.revertedWith("BEP20: burn amount exceeds balance");
		});
	});
});
