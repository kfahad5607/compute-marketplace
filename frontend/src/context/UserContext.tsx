import { jwtDecode, JwtPayload } from "jwt-decode";
import { apiClient, getAPIClient } from "@/services/api-client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

// types
interface User {
  id: number;
  email: string;
  name: string;
}

interface UserContextType {
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setAccessTokenAndUser: (token: string | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  accessToken: null,
  setUser: () => {},
  setAccessToken: () => {},
  setAccessTokenAndUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setAccessTokenAndUser = (token: string | null) => {
    try {
      if (!token) {
        setUser(null);
        setAccessToken(null);
        return;
      }

      const decodedToken = jwtDecode<JwtPayload & { user: User }>(token);

      setAccessToken(token);
      setUser(decodedToken.user);
    } catch (err) {
      console.log("ERROR ", err);
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = apiClient.interceptors.request.use((config) => {
      // if ("_retry" in config && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      // }

      return config;
    });

    return () => {
      apiClient.interceptors.request.eject(authInterceptor);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const refreshInterceptor = apiClient.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          await refreshAccessToken();

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return apiClient(originalRequest);
        }
      }
    );

    return () => {
      apiClient.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const refreshAccessToken = async () => {
    try {
      const apiClient = getAPIClient();
      const response = await apiClient.post("users/refresh-token");
      setAccessTokenAndUser(response.data.data.accessToken);
    } catch (err) {
      setAccessTokenAndUser(null);
      console.log("ERROR in refreshAccessToken", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        setUser,
        setAccessToken,
        setAccessTokenAndUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};
