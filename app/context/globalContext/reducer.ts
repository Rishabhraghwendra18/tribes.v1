import { Contracts } from "../../types";
import { State } from "./initalstate";

export type Action =
  | {
      type: "START_ASYNC";
    }
  | {
      type: "SET_ERROR";
      error: State["error"];
    }
  | {
      type: "SET_DISTRIBUTOR_CONTRACT";
      contract: Contracts["distributorContract"];
    }
  | {
      type: "SET_LOGO";
      logo: State["logo"];
    }
  | {
      type: "SET_TITLE";
      title: State["title"];
    }
  | {
      type: "SET_REGISTRY";
      registry: State["registry"];
    }
  | {
      type: "END_ASYNC";
    };

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "START_ASYNC": {
      return {
        ...state,
        loading: true,
      };
    }
    case "END_ASYNC": {
      return {
        ...state,
        loading: false,
      };
    }
    case "SET_ERROR": {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case "SET_LOGO": {
      return {
        ...state,
        logo: action.logo,
      };
    }
    case "SET_TITLE": {
      return {
        ...state,
        title: action.title,
      };
    }
    case "SET_DISTRIBUTOR_CONTRACT": {
      return {
        ...state,
        contracts: {
          ...state.contracts,
          distributorContract: action.contract,
        },
      };
    }
    case "SET_REGISTRY": {
      return {
        ...state,
        registry: action.registry,
      };
    }
    default:
      throw new Error("Bad action type");
  }
};
