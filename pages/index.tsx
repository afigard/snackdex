import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { Lato } from "next/font/google";
import Head from "next/head";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

type AllowedRatioColumns = "calories" | "carbs" | "fat";

export default function Home() {
  const [items, setItems] = useState<
    {
      id: number;
      name: string;
      brand: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }[]
  >([]);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [activeBrands, setActiveBrands] = useState<string[]>(["McDonald's"]);

  useEffect(() => {
    fetch("/api/items")
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  const handleSort = (column: string) => {
    const targetColumn = column
      .replace("protein", "")
      .replace("Ratio", "")
      .toLowerCase() as AllowedRatioColumns;
    const sortedItems = [...items].sort((a, b) => {
      if (sortOrder === "asc") {
        if (column === "name" || column === "brand") {
          return a[column].localeCompare(b[column]);
        } else if (
          column === "calories" ||
          column === "protein" ||
          column === "carbs" ||
          column === "fat"
        ) {
          return a[column] - b[column];
        } else {
          const ratioA =
            a[targetColumn] !== 0 ? a.protein / a[targetColumn] : 0;
          const ratioB =
            b[targetColumn] !== 0 ? b.protein / b[targetColumn] : 0;
          return ratioA - ratioB;
        }
      } else {
        if (column === "name" || column === "brand") {
          return b[column].localeCompare(a[column]);
        } else if (
          column === "calories" ||
          column === "protein" ||
          column === "carbs" ||
          column === "fat"
        ) {
          return b[column] - a[column];
        } else {
          const ratioA =
            a[targetColumn] !== 0 ? a.protein / a[targetColumn] : 0;
          const ratioB =
            b[targetColumn] !== 0 ? b.protein / b[targetColumn] : 0;
          return ratioB - ratioA;
        }
      }
    });

    setItems(sortedItems);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortColumn(column);
  };

  const handleBrandFilter = (brand: string) => {
    if (activeBrands.includes(brand)) {
      setActiveBrands(activeBrands.filter((b) => b !== brand));
    } else {
      setActiveBrands([...activeBrands, brand]);
    }
  };

  const filteredItems = items.filter((item) =>
    activeBrands.includes(item.brand)
  );

  return (
    <div className={`${styles.container} ${lato.className}`}>
      <Head>
        <title>Fast Food +</title>
        <meta
          name="description"
          content="Track French fast food nutrition easily"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <h1>Fast Food +</h1>
      <h3>by adrien figard</h3>

      <div className={styles.brandFilterContainer}>
        {["Burger King", "Carl's Jr.", "KFC", "McDonald's"].map((brand) => (
          <button
            key={brand}
            className={`${styles.brandButton} ${
              activeBrands.includes(brand) ? "" : styles.inactiveButton
            }`}
            onClick={() => handleBrandFilter(brand)}
          >
            {brand}
          </button>
        ))}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.databaseTable}>
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                className={styles.sortableHeader}
              >
                Name{" "}
                {sortColumn === "name"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("brand")}
                className={styles.sortableHeader}
              >
                Brand{" "}
                {sortColumn === "brand"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("calories")}
                className={styles.sortableHeader}
              >
                Calories{" "}
                {sortColumn === "calories"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("protein")}
                className={styles.sortableHeader}
              >
                Protein{" "}
                {sortColumn === "protein"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("carbs")}
                className={styles.sortableHeader}
              >
                Carbs{" "}
                {sortColumn === "carbs"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("fat")}
                className={styles.sortableHeader}
              >
                Fat{" "}
                {sortColumn === "fat" ? (sortOrder === "asc" ? "↑" : "↓") : "↓"}
              </th>
              <th
                onClick={() => handleSort("proteinCaloriesRatio")}
                className={styles.sortableHeader}
              >
                Protein/Calories{" "}
                {sortColumn === "proteinCaloriesRatio"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("proteinCarbsRatio")}
                className={styles.sortableHeader}
              >
                Protein/Carbs{" "}
                {sortColumn === "proteinCarbsRatio"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
              <th
                onClick={() => handleSort("proteinFatRatio")}
                className={styles.sortableHeader}
              >
                Protein/Fat{" "}
                {sortColumn === "proteinFatRatio"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : "↓"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className={styles.biggerFont}>{item.name}</td>
                <td>{item.brand}</td>
                <td className={styles.biggerFont}>{item.calories}</td>
                <td>
                  {item.protein}
                  <span className={styles.lowerFont}>g</span>
                </td>
                <td>
                  {item.carbs}
                  <span className={styles.lowerFont}>g</span>
                </td>
                <td>
                  {item.fat}
                  <span className={styles.lowerFont}>g</span>
                </td>
                <td
                  style={{
                    color:
                      item.calories !== 0 &&
                      item.protein / item.calories >= 0.075
                        ? "green"
                        : "red",
                  }}
                >
                  {item.calories !== 0
                    ? (item.protein / item.calories).toFixed(3)
                    : "N/A"}
                </td>
                <td
                  style={{
                    color:
                      item.carbs !== 0 && item.protein / item.carbs >= 1
                        ? "green"
                        : "red",
                  }}
                >
                  {item.carbs !== 0
                    ? (item.protein / item.carbs).toFixed(3)
                    : "N/A"}
                </td>
                <td
                  style={{
                    color:
                      item.fat !== 0 && item.protein / item.fat >= 1
                        ? "green"
                        : "red",
                  }}
                >
                  {item.fat !== 0
                    ? (item.protein / item.fat).toFixed(3)
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
