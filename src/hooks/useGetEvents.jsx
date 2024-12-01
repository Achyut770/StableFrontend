import { useContract, useContractEvents } from "@thirdweb-dev/react";
import React from "react";
import { governanceContractAddress } from "../utils/contractAddress";
import governanceContract from "../Abi/governanceContractAbi.json";

const useGetEvents = () => {
  const { contract } = useContract(
    governanceContractAddress,
    governanceContract.abi
  );
  return useContractEvents(contract, "ValidatePeg");
};

export default useGetEvents;
