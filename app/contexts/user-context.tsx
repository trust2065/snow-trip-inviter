// contexts/UserContext.tsx
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

export type UserWithRole = User & {
  role?: string;
};

type UserContextType = {
  user: UserWithRole | null;
};

const UserContext = createContext<UserContextType>({
  user: null,
});

export const useUser = () => useContext(UserContext);

export default UserContext;