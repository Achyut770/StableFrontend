import React, { useState, useMemo } from "react";
import useGetData from "../hooks/useGetData";
import {
  governanceContractAddress,
  reserveContractAddress,
  stableCoinAddress,
  USDTaddress,
  WETHaddress,
} from "../utils/contractAddress";
import { weiToEth } from "../utils/utils";
import governanceContract from "../Abi/governanceContractAbi.json";
import useValdatePeg from "../hooks/useValidatePeg";
import { Web3Button } from "@thirdweb-dev/react";
import SuccessMessage from "./SuccessMessage";

const StableCoinStatus = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const { data: totalSupply, refetch: refetchStableTotalSupply } = useGetData(
    "totalSupply",
    stableCoinAddress
  );
  const { data: prices } = useGetData(
    "getPrice",
    governanceContractAddress,
    [],
    governanceContract.abi
  );
  const { mutateAsync: validatePeg } = useValdatePeg();
  const { data: totalUsdtSupply } = useGetData("balanceOf", USDTaddress, [
    reserveContractAddress,
  ]);
  const { data: totalWETHSupply } = useGetData("balanceOf", WETHaddress, [
    reserveContractAddress,
  ]);

  const totalValuePegged = useMemo(() => {
    if (!prices || !totalUsdtSupply || !totalWETHSupply) return 0;

    const usdt_price = Number(prices.usdt_price);
    const eth_price = Number(prices.eth_price);
    const usdt_pegged = Number(totalUsdtSupply);
    const eth_pegged = Number(totalWETHSupply);
    return (usdt_price * usdt_pegged) / 1e8 + (eth_price * eth_pegged) / 1e8;
  }, [prices, totalUsdtSupply, totalWETHSupply]);

  const handleTransactionSuccess = (txResult) => {
    setSuccessMessage("ReEvaluate successful!");
    setTransactionHash(txResult?.receipt?.transactionHash || "N/A");
    refetchStableTotalSupply();
  };

  return (
    <div className="max-w-[400px] w-full mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        StableCoin Status
      </h1>
      {successMessage && (
        <SuccessMessage
          successMessage={successMessage}
          transactionHash={transactionHash}
        />
      )}
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Total Value Pegged:</span>
          <span className="text-gray-900 font-semibold">
            ${(totalValuePegged / 1e18).toFixed(4)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">
            Total Stable Coin Supply:
          </span>
          <span className="text-gray-900 font-semibold">
            {weiToEth(totalSupply)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">
            Price of Stable Coin:
          </span>
          <span className="text-gray-900 font-semibold">
            ${totalValuePegged / totalSupply}
          </span>
        </div>
        <Web3Button
          className="!w-full !bg-blue-600 !text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          contractAddress={governanceContractAddress}
          action={async () => {
            const txResult = await validatePeg({ arges: [] });
            handleTransactionSuccess(txResult);
          }}
        >
          Revalidate
        </Web3Button>
      </div>
    </div>
  );
};

export default StableCoinStatus;
