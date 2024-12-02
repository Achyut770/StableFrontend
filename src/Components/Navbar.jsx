import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";
import useGetData from "../hooks/useGetData";
import { stableCoinAddress } from "../utils/contractAddress";

const Navbar = () => {
  const { data: symbol, isLoading: isLoadingSymbol } = useGetData(
    "symbol",
    stableCoinAddress
  );
  const { data: name, isLoading: isLoadingName } = useGetData(
    "name",
    stableCoinAddress
  );

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="text-2xl font-bold tracking-wide">
          <a href="#" className="hover:text-blue-300">
            StableCoin
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:block bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm">
            <span className="font-semibold">Symbol:</span>{" "}
            <span>{!isLoadingSymbol ? symbol : "...."}</span>
          </div>

          <div className="hidden sm:block bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm">
            <span className="font-semibold">Name:</span>{" "}
            <span>{!isLoadingName ? name : "...."}</span>
          </div>

          {/* ConnectWallet Button */}
          <ConnectWallet />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
