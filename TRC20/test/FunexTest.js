var Token = artifacts.require("Funex");

contract("Funex", function (accounts) {
	describe("Owner / Minter Check", function () {
		it("should allow owner to mint", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					await token.mint(accounts[0], 1000000);
					return token.totalSupply.call();
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						1000000,
						"total supply is wrong"
					);
				});
		});

		it("should not allow non owner to mint", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					await token.mint(accounts[1], 1000000, {
						from: accounts[1],
					});
					return token.isMinter(accounts[1]);
				})
				.then(function (result) {
					assert.equal(
						result,
						false,
						"Another account is able to mint"
					);
					return token.balanceOf(accounts[1]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						0,
						"Another account has balance"
					);
				});
		});
	});

	describe("Transfer Check", function () {
		it("should transfer if have balance", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					return token.transfer(accounts[1], 1000);
				})
				.then(function (result) {
					return token.balanceOf(accounts[1]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						1000,
						"Transfer did not work"
					);
				});
		});

		it("should not transfer wihtout balance", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					return token.transfer(accounts[2], 5000, {
						from: accounts[1],
					});
				})
				.then(function (result) {
					return token.balanceOf(accounts[2]);
				})
				.then(function (result) {
					assert.equal(result.toNumber(), 0, "Transfer did not work");
				});
		});
	});

	describe("Transfer With Approval Check", function () {
		it("should transfer with approval", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					await token.approve(accounts[1], 1000);
					return token.transferFrom(accounts[0], accounts[1], 1000, {
						from: accounts[1],
					});
				})
				.then(function (result) {
					return token.balanceOf(accounts[1]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						2000, // Because first test transferred 1000
						"Transfer did not work"
					);
				});
		});

		it("should not transfer with approval without balance", function () {
			var token;
			var balance1;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					let balance = (
						await token.balanceOf(accounts[0])
					).toNumber();
					balance1 = (await token.balanceOf(accounts[1])).toNumber();
					await token.approve(accounts[1], balance);
					return token.transferFrom(
						accounts[0],
						accounts[1],
						balance + 1000,
						{
							from: accounts[1],
						}
					);
				})
				.then(function (result) {
					return token.balanceOf(accounts[1]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						balance1, // Should be same as before
						"Transfered without balance"
					);
				});
		});

		it("should not transfer without approval", function () {
			var token;
			var balance1;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					let balance = (
						await token.balanceOf(accounts[0])
					).toNumber();
					balance1 = (await token.balanceOf(accounts[1])).toNumber();
					await token.approve(accounts[1], balance - 1000);
					return token.transferFrom(
						accounts[0],
						accounts[1],
						balance,
						{
							from: accounts[1],
						}
					);
				})
				.then(function (result) {
					return token.balanceOf(accounts[1]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						balance1, // Should be same as before
						"Transfered without approval"
					);
				});
		});
	});

	describe("Burn Check", function () {
		var balance;
		it("should burn if have balance", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					balance = (await token.balanceOf(accounts[0])).toNumber();
					await token.burn(1000);
					return token.balanceOf(accounts[0]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						balance - 1000,
						"Burn did not work"
					);
				});
		});

		it("should not burn wihtout balance", function () {
			var token;
			return Token.deployed()
				.then(async function (instance) {
					token = instance;
					await token.burn(1000000);
					return token.balanceOf(accounts[0]);
				})
				.then(function (result) {
					assert.equal(
						result.toNumber(),
						balance - 1000,
						"Burn did not work"
					);
				});
		});
	});
});
