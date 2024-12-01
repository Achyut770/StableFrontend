import { BigNumber, utils } from "ethers";

export const isValidEthereumAddress = (address) => {
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(address);
};

export const ethToWei = (amount) => {
  if (isNaN(amount) || amount < 0) {
    return;
  }

  const weiValue = utils.parseUnits(amount.toString(), 18);
  return weiValue;
};

export const weiToEth = (weiValue) => {
  if (
    !weiValue ||
    (!BigNumber.isBigNumber(weiValue) && typeof weiValue !== "string")
  ) {
    return;
  }

  const ethValue = utils.formatUnits(weiValue, 18);

  return parseFloat(ethValue).toFixed(4);
};
