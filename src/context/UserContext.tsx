import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authApi, useCurrentPerson } from "@/services/auth";
import { hydrateSession, isSessionHydrated } from "@/services/auth/session";

export interface User {
  name: string;
  lastName: string;
  email: string;
  avatarUri: string | null;
}

export interface UserContextValue {
  user: User;
  /** Hay un access token en sesión. */
  isAuthenticated: boolean;
  /** La sesión guardada en disco todavía se está leyendo: no se navega aún. */
  isRestoring: boolean;
  /** Vuelve a leer correo, nombre, apellido y foto del backend. */
  refresh: () => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateLastName: (lastName: string) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updateAvatar: (avatarUri: string | null) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export interface UserProviderProps {
  children: ReactNode;
}

/** Sin sesión: pantalla de perfil vacía y acciones inertes. */
const EMPTY_USER: User = {
  name: "",
  lastName: "",
  email: "",
  avatarUri: null,
};

export function UserProvider({ children }: UserProviderProps) {
  const person = useCurrentPerson();
  const [isRestoring, setIsRestoring] = useState(!isSessionHydrated());

  // La sesión vive en disco; se lee una vez al arrancar para no cerrar la app
  // entre recargas ni saltarse el login de una sesión válida.
  useEffect(() => {
    let active = true;
    hydrateSession().finally(() => {
      if (active) setIsRestoring(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const user = useMemo<User>(
    () =>
      person
        ? {
            name: person.name,
            lastName: person.lastName,
            email: person.email,
            avatarUri: person.profileImage,
          }
        : EMPTY_USER,
    [person],
  );

  const refresh = useCallback(async () => {
    await authApi.refreshProfile();
  }, []);

  // El backend reemplaza el nombre como par: mandar solo uno deja ambos sin
  // cambios, así que siempre se envían los dos.
  const updateName = useCallback(
    async (name: string) => {
      await authApi.updateProfile({ name, lastName: user.lastName });
    },
    [user.lastName],
  );

  const updateLastName = useCallback(
    async (lastName: string) => {
      await authApi.updateProfile({ name: user.name, lastName });
    },
    [user.name],
  );

  const updateEmail = useCallback(async (email: string) => {
    await authApi.updateEmail(email);
  }, []);

  const updateAvatar = useCallback(async (avatarUri: string | null) => {
    await authApi.updateProfile({ profileImage: avatarUri ?? "" });
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(person),
      isRestoring,
      refresh,
      updateName,
      updateLastName,
      updateEmail,
      updateAvatar,
      signOut,
    }),
    [
      user,
      person,
      isRestoring,
      refresh,
      updateName,
      updateLastName,
      updateEmail,
      updateAvatar,
      signOut,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de <UserProvider>");
  return ctx;
}