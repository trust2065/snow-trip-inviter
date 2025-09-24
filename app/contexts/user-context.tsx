// contexts/UserContext.tsx
import { createContext, useContext } from 'react';
import { User } from '@supabase/supabase-js';

type UserContextType = {
  user: User | null;
};

export const UserContext = createContext<UserContextType>({
  user: null,
});

export const useUser = () => useContext(UserContext);