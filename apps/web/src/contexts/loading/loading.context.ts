import { createContext } from "react";

import { LoadingContextType } from "./loading.types";

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined);
