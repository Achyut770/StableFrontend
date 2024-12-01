import { useContract, useContractWrite } from "@thirdweb-dev/react";
import governanceContract from "../Abi/governanceContractAbi.json";
import { governanceContractAddress } from "../utils/contractAddress";

const useValdatePeg = () => {
  const { contract } = useContract(
    governanceContractAddress,
    governanceContract.abi
  );
  return useContractWrite(contract, "validatePeg");
};

export default useValdatePeg;
