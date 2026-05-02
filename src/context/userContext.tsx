"use client";

import { createContext, useContext } from "react";
import { useDbUser } from "../hooks/useDbUser";
import { useUser } from "@clerk/nextjs";

type UserContextType = {
  user: any;
  isSignedIn: boolean | undefined;
  dbUser: any;
  isLoadingDbUser: boolean;
};

const userContext = createContext<UserContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user, isLoaded } = useUser();

  const { userByEmail, isLoadingUserByEmail } = useDbUser({
    email: user?.emailAddresses?.[0]?.emailAddress!,
  });

  if (!isLoaded) return;

  return (
    <userContext.Provider
      value={{
        user,
        isSignedIn,
        dbUser: userByEmail,
        isLoadingDbUser: isLoadingUserByEmail,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

const useUserContext = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export { useUserContext, UserProvider };
