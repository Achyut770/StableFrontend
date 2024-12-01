import { useContract, useContractWrite } from "@thirdweb-dev/react";

const useApproveToken = (usdtAddress) => {
  const { contract } = useContract(usdtAddress);
  return useContractWrite(contract, "approve");
};

export default useApproveToken;
