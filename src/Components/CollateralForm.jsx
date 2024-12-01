// CollateralForm.js
import React, { useState } from "react";
import useGetData from "../hooks/useGetData";
import { reserveContractAddress } from "../utils/contractAddress";
import reserveContract from "../Abi/reserverContractAbi.json";
import useAddCollataral from "../hooks/useAddCollataral";
import { useAddress, Web3Button } from "@thirdweb-dev/react";
import useApproveToken from "../hooks/useApproveToken";
import { ethToWei, weiToEth } from "../utils/utils";
import SuccessMessage from "./SuccessMessage"; // Import the SuccessMessage component

const CollateralForm = ({ owner }) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  // Fetch collateral data
  const { data: firstCollateral } = useGetData(
    "rsvMap",
    reserveContractAddress,
    [0],
    reserveContract.abi
  );
  const { data: secondCollateral } = useGetData(
    "rsvMap",
    reserveContractAddress,
    [1],
    reserveContract.abi
  );
  const loggedUserAddress = useAddress();

  const { data: allowance } = useGetData("allowance", address, [
    loggedUserAddress,
    reserveContractAddress,
  ]);

  const { mutateAsync: addCollataral } = useAddCollataral(
    reserveContractAddress
  );

  const { mutateAsync: approve } = useApproveToken(address);

  const handleAmountValidation = () => {
    if (!address || !amount) {
      alert("Please fill out both fields.");
      return false;
    }
    if (Number(amount) <= 0) {
      alert("Amount must be greater than zero.");
      return false;
    }
    return true;
  };

  const handleActionSuccess = (txResult, isApprove) => {
    const actionType = isApprove ? "Approval" : "Submission";
    setSuccessMessage(`${actionType} successful!`);
    setTransactionHash(txResult?.receipt?.transactionHash || "N/A");
  };

  const shouldApprove = Number(amount) > Number(weiToEth(allowance));

  if (owner !== loggedUserAddress) {
    return (
      <div className="max-w-[400px]  w-full mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg text-2xl font-semibold text-gray-800 flex justify-center items-center">
        You are not the owner to add collataral amount
      </div>
    );
  }
  return (
    <div className="max-w-[400px] w-full mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Collateral
      </h1>

      <SuccessMessage
        successMessage={successMessage}
        transactionHash={transactionHash}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!handleAmountValidation()) return;
        }}
        className="space-y-4"
      >
        {/* Select for Collateral Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Select Collateral Address:
          </label>
          <select
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Address --</option>
            {firstCollateral?.collatral && (
              <option value={firstCollateral.collatral}>
                {firstCollateral.collatral}
              </option>
            )}
            {secondCollateral?.collatral && (
              <option value={secondCollateral.collatral}>
                {secondCollateral.collatral}
              </option>
            )}
          </select>
        </div>

        {/* Input for Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Enter Amount:
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Collateral Amount"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit/Approve Button */}
        <Web3Button
          className="!w-full !bg-blue-600 !text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          contractAddress={shouldApprove ? address : reserveContractAddress}
          action={async () => {
            const txResult = shouldApprove
              ? await approve({
                  args: [reserveContractAddress, ethToWei(amount)],
                })
              : await addCollataral({ args: [address, ethToWei(amount)] });
            console.log("txResult", txResult);
            handleActionSuccess(txResult, shouldApprove);
          }}
        >
          {shouldApprove ? "Approve" : "Submit"}
        </Web3Button>
      </form>
    </div>
  );
};

export default CollateralForm;
