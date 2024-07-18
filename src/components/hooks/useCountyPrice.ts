import React from "react";

export const useCountyPrice = () => {
  let inrCurrency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "JPY",
  });

  return inrCurrency;
};
