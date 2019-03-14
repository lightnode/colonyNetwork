/* globals artifacts */
const { WAD, INITIAL_FUNDING } = require("../../helpers/constants");

const EtherRouter = artifacts.require("EtherRouter");
const IColonyNetwork = artifacts.require("IColonyNetwork");
const IMetaColony = artifacts.require("IMetaColony");
const IReputationMiningCycle = artifacts.require("IReputationMiningCycle");
const Token = artifacts.require("Token");

module.exports = async function(callback) {
  try {
    const accounts = await web3.eth.getAccounts();
    const USER1 = accounts[1];

    console.log("*".repeat(20));
    console.log("SETTING UP NETWORK");

    const etherRouter = await EtherRouter.deployed();
    const colonyNetwork = await IColonyNetwork.at(etherRouter.address);

    const metaColonyAddress = await colonyNetwork.getMetaColony();
    const metaColony = await IMetaColony.at(metaColonyAddress);
    const clnyTokenAddress = await metaColony.getToken();
    const clnyToken = await Token.at(clnyTokenAddress);

    console.log("*".repeat(20));
    console.log("CREATING TASKS");

    await metaColony.mintTokens(INITIAL_FUNDING);
    await metaColony.claimColonyFunds(clnyToken.address);

    // eslint-disable no-plusplus
    for (let i = 1; i <= 10; i += 1) {
      await metaColony.addPayment(1, 0, USER1, clnyToken.address, WAD, 1, 0);
      await metaColony.moveFundsBetweenPots(1, 0, 0, 1, i + 1, WAD, clnyToken.address);
      await metaColony.finalizePayment(1, 0, i);
    }

    const addr = await colonyNetwork.getReputationMiningCycle(false);
    const repCycle = await IReputationMiningCycle.at(addr);
    const numUpdates = await repCycle.getReputationUpdateLogLength();

    console.log("*".repeat(20));
    console.log(numUpdates.toString());

    callback();
  } catch (err) {
    callback(err);
  }
};
