var Token = artifacts.require("Funex");

contract("Funex", function (accounts) {
	it("Should have correct symbol and decimal", function () {
		var token;
		return Token.deployed()
			.then(function (instance) {
				token = instance;
				return token.symbol();
			})
			.then(function (symbol) {
				assert.equal(symbol, "FNX", "has the correct symbol");
				return token.decimals();
			})
			.then(function (decimals) {
				assert.equal(decimals, 18, "has the correct decimals");
			});
	});

	it("Should pass all minter role transfer tests", function () {
		var token;
		return Token.deployed()
			.then(async function (instance) {
				token = instance;
				await token.addMinter(accounts[1]);
				return token.isMinter(accounts[1]);
			})
			.then(function (result) {
				assert.equal(result, true, "Minter not added");
				return token.renounceMinter({ from: accounts[1] });
			})
			.then(function (result) {
				return token.isMinter(accounts[1]);
			})
			.then(function (result) {
				assert.equal(result, false, "Minter not removed");
			});
	});

	it("should allow minter to mint", function () {
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
				return token.balanceOf(accounts[0]);
			})
			.then(function (result) {
				assert.equal(result.toNumber(), 1000000, "balance is wrong");
				return token.isMinter(accounts[0]);
			});
	});

	it("should not allow non minter to mint", function () {
		var token;
		return Token.deployed()
			.then(async function (instance) {
				token = instance;
				let x = await token.mint(accounts[1], 1000000, {
					from: accounts[1],
				});
				return token.isMinter(accounts[1]);
			})
			.then(function (result) {
				assert.equal(result, false, "Another account is able to mint");
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

	it("should transfer if have balance", function () {
		var token;
		return Token.deployed()
			.then(async function (instance) {
				token = instance;
				await token.transfer(accounts[1], 1000);
				return token.balanceOf(accounts[1]);
			})
			.then(function (result) {
				assert.equal(result.toNumber(), 1000, "Transfer did not work");
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
				let balance = (await token.balanceOf(accounts[0])).toNumber();
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
				let balance = (await token.balanceOf(accounts[0])).toNumber();
				balance1 = (await token.balanceOf(accounts[1])).toNumber();
				await token.approve(accounts[1], balance - 1000);
				return token.transferFrom(accounts[0], accounts[1], balance, {
					from: accounts[1],
				});
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

	it("should increase / decrease allowance", function () {
		var token;
		var allowance;
		return Token.deployed()
			.then(async function (instance) {
				token = instance;
				allowance = (
					await token.allowance(accounts[0], accounts[1])
				).toNumber();
				await token.increaseAllowance(accounts[1], 1000);
				return token.allowance(accounts[0], accounts[1]);
			})
			.then(function (result) {
				assert.equal(
					result.toNumber(),
					allowance + 1000,
					"Allowance did not increase"
				);
				return token.decreaseAllowance(accounts[1], 500);
			})
			.then(function (result) {
				return token.allowance(accounts[0], accounts[1]);
			})
			.then(function (result) {
				assert.equal(
					result.toNumber(),
					allowance + 500,
					"Allowance did not decrease"
				);
			});
	});

	it("should check all zero address checks", function () {
		var token;
		var balance1;
		var allowance1;
		return Token.deployed()
			.then(async function (instance) {
				token = instance;
				balance1 = (await token.balanceOf(accounts[0])).toNumber();
				await token.transfer(
					"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
					1000
				);
				return token.balanceOf(accounts[0]);
			})
			.then(async function (result) {
				assert.equal(
					result.toNumber(),
					balance1,
					"Sent to zero address"
				);
				await token.approve("T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb", 1000);
				return token.allowance(
					accounts[0],
					"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
				);
			})
			.then(async function (result) {
				assert.equal(result.toNumber(), 0, "Approved to zero address");
				balance1 = (
					await token.balanceOf("T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb")
				).toNumber();
				await token.mint("T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb", 1000);
				return token.balanceOf("T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb");
			})
			.then(async function (result) {
				assert.equal(
					result.toNumber(),
					balance1,
					"Minted to zero address"
				);
				await token.increaseAllowance(
					"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
					1000
				);
				return token.allowance(
					accounts[0],
					"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
				);
			})
			.then(async function (result) {
				assert.equal(
					result.toNumber(),
					0,
					"Increased allowance to zero address"
				);
				await token.decreaseAllowance(
					"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb",
					1000
				);
				return token.allowance(
					accounts[0],
					"T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb"
				);
			})
			.then(async function (result) {
				assert.equal(
					result.toNumber(),
					0,
					"Decreased allowance to zero address"
				);
			});
	});

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
