import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface User {
  name: string;
  lastName: string;
  email: string;
  avatarUri: string | null;
}

// TODO: persistencia. El usuario y la foto viven solo en memoria y se pierden
// al recargar; aquí se engancha el backend (o AsyncStorage) más adelante.
const INITIAL_USER: User = {
  name: "Usuario001",
  lastName: "Apellido001",
  email: "Usuario001@email.com",
  avatarUri: null,
};

export interface UserContextValue {
  user: User;
  updateName: (name: string) => void;
  updateLastName: (lastName: string) => void;
  updateEmail: (email: string) => void;
  updateAvatar: (avatarUri: string | null) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(INITIAL_USER);

  // TODO: cambio de correo. En producción habría que verificar el nuevo correo
  // con un código OTP (ver VerifyAccountScreen); por ahora se actualiza directo.
  const updateName = useCallback((name: string) => {
    setUser((current) => ({ ...current, name }));
  }, []);

  const updateLastName = useCallback((lastName: string) => {
    setUser((current) => ({ ...current, lastName }));
  }, []);

  const updateEmail = useCallback((email: string) => {
    setUser((current) => ({ ...current, email }));
  }, []);

  const updateAvatar = useCallback((avatarUri: string | null) => {
    setUser((current) => ({ ...current, avatarUri }));
  }, []);

  const resetUser = useCallback(() => {
    setUser(INITIAL_USER);
  }, []);

  const value = useMemo(
    () => ({
      user,
      updateName,
      updateLastName,
      updateEmail,
      updateAvatar,
      resetUser,
    }),
    [
      user,
      updateName,
      updateLastName,
      updateEmail,
      updateAvatar,
      resetUser,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de <UserProvider>");
  return ctx;
}
