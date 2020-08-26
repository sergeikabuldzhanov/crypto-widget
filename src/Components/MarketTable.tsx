import React from "react";
import MarketRow from "./MarketRow";
import { PairData } from "./MarketWidget";
import useSortableData from "../Hooks/UseSortableData";

interface IProps {
  filter: string | null;
  marketData: PairData[];
}

export default function MarketTable({ filter, marketData }: IProps) {
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
