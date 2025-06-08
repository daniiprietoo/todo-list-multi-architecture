import { useUserContext } from "./user-context";

export const useUser = () => {
  return useUserContext();
};
