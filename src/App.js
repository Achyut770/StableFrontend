import React from "react";
import "./App.css";
import AddCollateral from "./Components/AddColataral";
import CollateralForm from "./Components/CollateralForm";
import Navbar from "./Components/Navbar";
import StableCoinStatus from "./Components/StableCoinStatus";
import PriceHistory from "./Components/PriceHistory"; // Import PriceHistory
import useGetData from "./hooks/useGetData";
import { reserveContractAddress } from "./utils/contractAddress";

function App() {
  const { data: owner } = useGetData("owner", reserveContractAddress);
  console.log("Owner", owner);
  return (
    <div>
      <Navbar />
      <div className="p-6 space-y-6 flex gap-3 flex-row flex-wrap ">
        <AddCollateral owner={owner} />
        <CollateralForm owner={owner} />
        <StableCoinStatus />
      </div>
      <PriceHistory /> {/* Add PriceHistory component */}
    </div>
  );
}

export default App;
