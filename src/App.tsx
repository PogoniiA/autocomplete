import React, { ChangeEvent, useCallback, useMemo, useState } from "react";
import "./App.css";
import Autocomplete from "./components/Autocomplete/Autocomplete";
import useSearchCountries from "./hooks/useSearchCountries";
import { searchDebounce } from "./utils/searchDebounce";

function App() {
  const { setSearchQuery, result, isLoading } = useSearchCountries();
  const [selected, setSelected] = useState("");

  const debaunce = useMemo(() => {
    const setValue = (value: string) => setSearchQuery(value);
    return searchDebounce(setValue, 500);
  }, [setSearchQuery]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSelected(e.target.value);
      debaunce(e.target.value);
    },
    [setSelected, debaunce]
  );

  const enhancedOptions = useMemo(() => {
    return result.map((option) => {
      return {
        title: option,
        key: option,
      };
    });
  }, [result]);

  return (
    <div className="App">
      <div className="App-content">
        <Autocomplete
          onChange={handleInputChange}
          selectedValue={selected}
          onSelect={setSelected}
          options={enhancedOptions}
          placeholder="Search countries..."
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default App;
