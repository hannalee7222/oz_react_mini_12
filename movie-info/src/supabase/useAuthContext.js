import { useContext } from 'react';
import { AuthContext } from './authContext';

export function useAuthContext() {
  return useContext(AuthContext);
}
