"use client"


import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";
import { useDbUser } from "../hooks/useDbUser";

type UserContextType = {
  user: any;
  status: string;
  isAuthenticated: boolean;
  dbUser: any;
  isLoadingDbUser: boolean;
};

const userContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, status } = useSession();

  const user = data?.user;
  const isAuthenticated = !!user && status === "authenticated";

  const { userByEmail, isLoadingUserByEmail } = useDbUser({
    email: user?.email!,
  });

  if (status === "loading" && isLoadingUserByEmail) {
    return <p>Loading...</p>;
  }

  return (
    <userContext.Provider
      value={{
        user,
        status,
        isAuthenticated,
        dbUser: userByEmail,
        isLoadingDbUser: isLoadingUserByEmail,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export { useUser, UserProvider };
