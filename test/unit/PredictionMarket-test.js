const { assert, expect } = require("chai");
const { networks, deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

if (developmentChains.includes(network.name)) {
  describe("Prediction Market Tests", async function () {
    let deployer, player, player1, player2, predictionMarket, accounts;
    const price = ethers.utils.parseEther("1");
    const price1 = ethers.utils.parseEther("2");
    const price2 = ethers.utils.parseEther("3");
    const price3 = ethers.utils.parseEther("4");

    beforeEach(async () => {
      deployer = (await getNamedAccounts()).deployer;
      accounts = await ethers.getSigners();

      player = accounts[2];
      player1 = accounts[3];
      player2 = accounts[4];

      await deployments.fixture(["all"]);

      predictionMarket = await ethers.getContract("PredictionMarket", deployer);
    });

    it("Creating and withdrawing bets", async function () {
      // Betting
      await predictionMarket.createBet("Trump", { value: price });
      const initialBalance3 = await predictionMarket.provider.getBalance(
        deployer
      );

      const predictionMarket1 = predictionMarket.connect(player);
      await predictionMarket1.createBet("Biden", { value: price1 });
      const initialBalance1 = await predictionMarket1.provider.getBalance(
        player.address
      );

      const predictionMarket2 = predictionMarket.connect(player1);
      await predictionMarket2.createBet("Biden", { value: price2 });
      const initialBalance2 = await predictionMarket2.provider.getBalance(
        player1.address
      );

      const predictionMarket3 = predictionMarket.connect(player2);
      await predictionMarket3.createBet("Trump", { value: price3 });

      // Announcing Results :
      const oracle = predictionMarket.connect(accounts[1]);
      await oracle.reportResultsOfElection("Biden", "Trump");

      const txResponse1 = await predictionMarket1.withdrawGain();
      const txReceipt1 = await txResponse1.wait(1);
      const gasFees1 = txReceipt1.gasUsed.mul(txReceipt1.effectiveGasPrice);

      const txResponse2 = await predictionMarket2.withdrawGain();
      const txReceipt2 = await txResponse2.wait(1);
      const gasFees2 = txReceipt2.gasUsed.mul(txReceipt2.effectiveGasPrice);

      const finalBalance1 = await predictionMarket1.provider.getBalance(
        player.address
      );

      const finalBalance2 = await predictionMarket2.provider.getBalance(
        player1.address
      );

      const finalBalance3 = await predictionMarket.provider.getBalance(
        deployer
      );

      const supposed_balance =
        (price.add(price1).add(price2).add(price3) * 2) / 5;

      const supposed_balance1 =
        (price.add(price1).add(price2).add(price3) * 3) / 5;

      assert.equal(
        finalBalance1.add(gasFees1).sub(initialBalance1).toString(),
        supposed_balance.toString()
      );

      assert.equal(
        finalBalance2.add(gasFees2).sub(initialBalance2).toString(),
        supposed_balance1.toString()
      );
    });
  });
}
