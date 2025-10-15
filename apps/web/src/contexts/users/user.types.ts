import { JSX, ReactNode } from "react";

import { UserEntity } from "../../shared/types";

export interface UserContextType {
  users: UserEntity[];
  loading: boolean;
  loadUsers: () => Promise<void>;
  renderUserList: () => JSX.Element;
  handleNextPage: () => void;
}

export type UserProviderProps = {
  children: ReactNode;
}
