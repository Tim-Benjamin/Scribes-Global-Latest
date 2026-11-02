import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface CursorContextValue {
  label: string;
  setLabel: (label: string) => void;
}

const CursorContext =
  createContext<CursorContextValue | null>(null);

export function CursorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [label, setLabel] = useState("");

  return (
    <CursorContext.Provider
      value={{
        label,
        setLabel,
      }}
    >
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);

  if (!context) {
    throw new Error(
      "useCursor must be used inside CursorProvider"
    );
  }

  return context;
}