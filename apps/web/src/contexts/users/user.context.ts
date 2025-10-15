import { createContext } from "react";

import { UserContextType } from "./user.types";

export const UserContext = createContext<UserContextType | undefined>(undefined);
