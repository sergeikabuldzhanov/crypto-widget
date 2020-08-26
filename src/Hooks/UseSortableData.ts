import { PairData } from "./../Components/MarketWidget";
import { useMemo, useState } from "react";

type Config = { direction?: string; key: string } | null;

/**
 *
 * @param items an array of objects to be sorted
 * @param config optional config object, if not given - data is returned in the same order it was recieved
 * possible properties:
 * key - sorts items by that key in ascending order
 * direction - 'asc' | 'desc' direction of sort.
 */
const useSortableData = (items: PairData[], config: Config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  /**
   * Sorts items by the given key in ascending order. 
   * If already sorted by this key - changes order from ascending to descending and vice versa
   * @param key sorts the items by this key
   */
  const requestSort = (key: string) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort };
};

export default useSortableData;
