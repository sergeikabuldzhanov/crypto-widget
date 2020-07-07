import React from "react";
import MarketRow from "./MarketRow";
import useSortableData from "../../../hooks/useSortableData";

export default function MarketTable({ filter, marketData }) {
  let { items, requestSort } = useSortableData(marketData, null);
  if (filter) items = items.filter((data) => data.pm === filter);

  return (
    <table className="market-widget__table">
      <caption className="screen-reader-only">
        Trading data on currency pairs
      </caption>
      <thead>
        <tr>
          <th className="faint" scope="col" onClick={() => requestSort("s")}>
            Pair
          </th>
          <th className="faint" scope="col" onClick={() => requestSort("an")}>
            Coin
          </th>
          <th className="faint" scope="col" onClick={() => requestSort("c")}>
            Price
          </th>
          <th className="faint" scope="col" onClick={() => requestSort("ch")}>
            Change
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((data) => (
          <MarketRow key={data.s} data={data} />
        ))}
      </tbody>
    </table>
  );
}
