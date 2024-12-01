import { useAddress, Web3Button } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import useAddCollataralAddress from "../hooks/useAddCollataralAddress";
import useApproveToken from "../hooks/useApproveToken";
import { reserveContractAddress } from "../utils/contractAddress";
import { ethToWei, isValidEthereumAddress, weiToEth } from "../utils/utils";
import useGetData from "../hooks/useGetData";
import SuccessMessage from "./SuccessMessage";

const AddCollateral = ({ owner }) => {
  const [formState, setFormState] = useState({
    address: "",
    amount: "",
    error: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState("");

  const { address, amount, error } = formState;
  const loggedUserAddress = useAddress();
  const { data: allowance } = useGetData("allowance", address, [
    loggedUserAddress,
    reserveContractAddress,
  ]);

  const { mutateAsync: deposit } = useAddCollataralAddress(
    reserveContractAddress
  );
  const { mutateAsync: approve } = useApproveToken(address);

  const shouldApprove = Number(amount) > Number(weiToEth(allowance));

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
      error: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setSuccessMessage("");
    setTransactionHash("");
  };

  const validateInput = () => {
    if (!isValidEthereumAddress(address)) {
      setFormState((prev) => ({
        ...prev,
        error: "Invalid Ethereum address. Please enter a valid one.",
      }));
      return false;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setFormState((prev) => ({
        ...prev,
        error: "Invalid amount. Please enter a positive number.",
      }));
      return false;
    }
    return true;
  };

  const handleTransactionSuccess = (txResult, isApprove) => {
    const actionType = isApprove ? "Approval" : "Deposit";
    setSuccessMessage(`${actionType} successful!`);
    setTransactionHash(txResult?.receipt?.transactionHash || "N/A");
  };

  if (owner !== loggedUserAddress) {
    return (
      <div className="max-w-[400px]  w-full mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg text-2xl font-semibold text-gray-800 flex justify-center items-center">
        You are not the owner to add new collataral token
      </div>
    );
  }

  return (
    <div className="max-w-[400px] w-full mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add New Collateral
      </h1>

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          successMessage={successMessage}
          transactionHash={transactionHash}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Input */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Enter Address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleInputChange}
            placeholder="Enter your Ethereum address"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Amount Input */}
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
            onChange={handleInputChange}
            placeholder="Enter amount"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Error Messages */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Action Button */}
        <Web3Button
          className="!w-full !bg-blue-600 !text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          contractAddress={shouldApprove ? address : reserveContractAddress}
          action={async () => {
            const txResult = shouldApprove
              ? await approve({
                  args: [reserveContractAddress, ethToWei(amount)],
                })
              : await deposit({ args: [address, ethToWei(amount)] });
            handleTransactionSuccess(txResult, shouldApprove);
          }}
        >
          {shouldApprove ? "Approve" : "Submit"}
        </Web3Button>
      </form>
    </div>
  );
};

export default AddCollateral;
