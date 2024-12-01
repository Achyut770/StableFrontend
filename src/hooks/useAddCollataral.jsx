import { useContract, useContractWrite } from "@thirdweb-dev/react";
import reserveContractabi from "../Abi/reserverContractAbi.json";
import { reserveContractAddress } from "../utils/contractAddress";

const useAddCollataral = () => {
  const { contract } = useContract(
    reserveContractAddress,
    reserveContractabi.abi
  );
  return useContractWrite(contract, "addCollateralAmount");
};

export default useAddCollataral;
