const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const accounts = await ethers.getSigners();

  const chainId = network.config.chainId;
  const args = [accounts[1].address];

  const predictionMarket = await deploy("PredictionMarket", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(predictionMarket.address, args);
  }

  log(".......");
};

module.exports.tags = ["all", "predictionMarket"];
