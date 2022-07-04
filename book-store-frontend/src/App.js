import axios from "axios";
import { useState, useEffect } from "react";

import "./App.css";
import BookStore from "./components/BookStore";
import { normalizeJSONAPI } from "./utils";

function App() {
  const [data, setData] = useState({});

  // fetch data including stores, books, authors, countries from API on mount and normalize the data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/stores", {
          headers: {
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json",
          },
        });

        if (response.status === 200) {
          const JSONAPIData = response.data;
          const normalizedData = normalizeJSONAPI(JSONAPIData);
          setData(normalizedData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <h1 className="app__header">Squirro Book Stores</h1>

      {/* display the stores */}
      {data.stores?.map((store) => (
        <BookStore key={store.id} store={store} data={data} setData={setData} />
      ))}
    </div>
  );
}

export default App;
