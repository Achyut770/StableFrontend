import { useContract, useContractWrite } from "@thirdweb-dev/react";
import reserveContractabi from "../Abi/reserverContractAbi.json";
import { reserveContractAddress } from "../utils/contractAddress";

const useAddCollataralAddress = () => {
  const { contract } = useContract(
    reserveContractAddress,
    reserveContractabi.abi
  );
  return useContractWrite(contract, "deposit");
};

export default useAddCollataralAddress;
