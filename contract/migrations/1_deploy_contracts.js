// const ConvertLib = artifacts.require("ConvertLib");
// const MetaCoin = artifacts.require("MetaCoin");

// module.exports = function(deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };

const KaziKrypto  = artifacts.require("KaziKrypto");
// const MetaCoin = artifacts.require("MetaCoin");

module.exports = function(deployer) {
  // deployer.deploy(KaziKrypto,KaziKryptoFreelancer.address);
  // deployer.link(VendingMachine);
  // deployer.deploy(MetaCoin);

  deployer.deploy(KaziKrypto).then((instance) => {
    console.log("KaziKrypto contract deployed at address:", instance.address);
  });
};