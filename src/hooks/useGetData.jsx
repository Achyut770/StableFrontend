import { useContract, useContractRead } from "@thirdweb-dev/react";

const useGetData = (functionName, contractAddress, args = [], abi = null) => {
  const { contract } = useContract(contractAddress, abi ? abi : undefined);

  const contractReadConfig =
    args.length > 0 ? [functionName, args] : [functionName];

  return useContractRead(contract, ...contractReadConfig);
};

export default useGetData;
