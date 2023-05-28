import { useCallback, useEffect, useReducer } from "react";
import { API_COUNTRIES } from "../apiMap";

const getData = async (searchText?: string) => {
  let query = !searchText ? `_limit=3` : `q=${searchText}`;
  const response = await fetch(`${API_COUNTRIES}/data?${query}`, {
    method: "GET",
  });

  if (response.ok) {
    return response.json();
  }
  throw new Error("Something went wrong");
};

enum Actions {
  SET_QUERY = "SET_QUERY",
  SET_IS_LOADING = "SET_IS_LOADING",
  SET_RESULT = "SET_RESULT",
  SET_ERROR = "SET_ERROR",
}

interface State {
  searchQuery: string;
  isLoading: boolean;
  result: string[];
  error: boolean;
}
type ReducerActionSearchQuery = {
  type: Actions.SET_QUERY;
  payload: string;
};
type ReducerActionIsLoading = {
  type: Actions.SET_IS_LOADING;
  payload: boolean;
};
type ReducerActionResult = {
  type: Actions.SET_RESULT;
  payload: string[];
};
type ReducerActionError = { type: Actions.SET_ERROR; payload: boolean };

type ReducerAction =
  | ReducerActionSearchQuery
  | ReducerActionIsLoading
  | ReducerActionResult
  | ReducerActionError;

const reducer = (state: State, action: ReducerAction): State => {
  switch (action.type) {
    case Actions.SET_QUERY: {
      return {
        ...state,
        searchQuery: action.payload,
      };
    }
    case Actions.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case Actions.SET_RESULT: {
      return {
        ...state,
        result: action.payload,
      };
    }
    case Actions.SET_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }
  }
};

const useSearchCountries = () => {
  const [state, dispatch] = useReducer<React.Reducer<State, ReducerAction>>(
    reducer,
    {
      searchQuery: "",
      isLoading: false,
      result: [],
      error: false,
    }
  );

  const setSearchQuery = useCallback(
    (value: string) => {
      dispatch({ type: Actions.SET_QUERY, payload: value });
    },
    [dispatch]
  );

  const fetchData = async (searchQuery?: string) => {
    dispatch({ type: Actions.SET_IS_LOADING, payload: true });
    try {
      const data = await getData(searchQuery);
      const result = data.map(({ name }: { name: string }) => name);

      dispatch({ type: Actions.SET_RESULT, payload: result });
    } catch (error) {
      dispatch({ type: Actions.SET_RESULT, payload: [] });
      dispatch({ type: Actions.SET_ERROR, payload: true });
    } finally {
      dispatch({ type: Actions.SET_IS_LOADING, payload: false });
    }
  };

  const loadResult = useCallback(() => {
    if (!state.searchQuery) {
      fetchData();
    } else {
      fetchData(state.searchQuery);
    }
  }, [state.searchQuery]);

  useEffect(() => {
    loadResult();
  }, [state.searchQuery, loadResult]);

  return {
    ...state,
    setSearchQuery,
  };
};

export default useSearchCountries;
