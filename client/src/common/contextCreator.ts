import { Context, createContext, useContext } from "react";

interface INewContextProps<T> {
  context: Context<T | undefined>;
  useContext: () => T;
};

export function createNewContext<T>(defaultValue?: T): INewContextProps<T> {
  const context = createContext<T | undefined>(defaultValue);

  const useCustomContext = () => {
    const value = useContext(context);
    if (value === undefined) {
      throw new Error("useContext must be used within a Provider");
    }
    return value;
  };

  return { context, useContext: useCustomContext };
}
