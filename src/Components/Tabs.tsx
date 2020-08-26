import React from "react";

interface IProps {
  tabs: string[];
  tabFilter: string | null;
  setTabFilter: React.Dispatch<React.SetStateAction<string | null>>;
}

const Tabs = ({ tabs, tabFilter, setTabFilter }: IProps) => {
  return (
    <div className="market-widget__tabs tabs">
      <button
        key={"ALL"}
        className={`tab${tabFilter === null ? " tab--active" : ""}`}
        onClick={() => setTabFilter(null)}>
        ALL
      </button>
      {tabs.map((market_name) => (
        <button
          key={market_name}
          className={`tab${tabFilter === market_name ? " tab--active" : ""}`}
          onClick={() => setTabFilter(market_name)}>
          {market_name}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
