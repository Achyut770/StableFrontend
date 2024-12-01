// SuccessMessage.js
import React from "react";

const SuccessMessage = ({ successMessage, transactionHash }) => {
  return (
    successMessage && (
      <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
        <p>{successMessage}</p>
        {transactionHash && (
          <p className="text-sm mt-2">
            See transaction hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {`${transactionHash.slice(0, 5)}...${transactionHash.slice(-5)}`}
            </a>
          </p>
        )}
      </div>
    )
  );
};

export default SuccessMessage;
