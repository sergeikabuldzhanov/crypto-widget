import React, { memo } from "react";
import { PairData } from "./MarketWidget";

function formatPrice(price: number) {
  return price > 10000
    ? price.toFixed(0)
    : price > 100
    ? price.toFixed(2)
    : price < 1e-6
    ? price.toFixed(8)
    : price + "";
}

function MarketRow({ data }:PairData) {
  return (
    <tr className="table__item" key={data.s}>
      <td className={`item`}>
        {data.b}
        <span className="faint"> / {data.q}</span>
      </td>
      <td className={`item`}>{data.an}</td>
      <td className={`item`}>{`${formatPrice(data.c)}`}</td>
      <td className={`item ${data.ch < 0 ? "item--fallen" : "item--risen"}`}>
        {`${(data.ch < 0 ? "" : "+") + data.ch.toFixed(2)}%`}
      </td>
    </tr>
  );
}

export default memo(MarketRow);
