var FUNEX = artifacts.require("./Funex.sol");

module.exports = function (deployer) {
	deployer.deploy(FUNEX, "Funex", "FNX", 18);
};
