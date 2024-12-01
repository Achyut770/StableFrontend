import React, { useEffect, useState } from "react";
import useGetEvents from "../hooks/useGetEvents";
import PriceHistoryChart from "./PriceHistoryChart";

const PriceHistory = () => {
  const [priceHistory, setPriceHistory] = useState([]);

  const { data: events, isLoading } = useGetEvents();

  useEffect(() => {
    const fetchPriceHistory = async () => {
      const datas = events?.map((items) => {
        const dateObj = new Date(Number(items.data.time) * 1000);

        const date = dateObj.toISOString().split("T")[0];
        const price =
          items.data.stableTotalSupply == 0.0
            ? 0
            : items.data.reserveValue / items.data.stableTotalSupply;
        return { price, date };
      });
      console.log("Datas", datas);
      const finalData = datas?.reverse();

      setPriceHistory(finalData || []);
    };

    fetchPriceHistory();
  }, [events]);

  return (
    <div className="p-6 space-y-6   mx-auto">
      <h1 className="text-2xl  font-bold text-gray-800">
        Stablecoin Price History
      </h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <PriceHistoryChart data={priceHistory} />
      )}
    </div>
  );
};

export default PriceHistory;
