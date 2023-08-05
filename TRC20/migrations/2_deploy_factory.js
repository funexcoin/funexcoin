var Funex = artifacts.require('./FUNEX.sol');

module.exports = function (deployer, network) {
  if (network == 'nile') deployer.deploy(Funex);
};
