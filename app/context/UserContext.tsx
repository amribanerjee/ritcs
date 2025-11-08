"use client";

import React, { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "@/app/types";

interface authorisationContext {
  atoken?: string | null;
  currentUser?: User | null;
  setUser: (password: string, username: string) => void;
  removeUser: () => void;
}

const UserContext = createContext<authorisationContext | undefined>(undefined);
type props = PropsWithChildren<{
  initialUser?: User | null;
}>;

export function UserProvider({ children, initialUser = null }: props) {
  const [atoken, setAtoken] = useState<string | null>(initialUser?.atoken ?? null);
  const [user, setUser] = useState<User | null>(initialUser ?? null);

  async function fetchUser(username: string, password: string): Promise<void> {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      setUser(null);
      setAtoken(null);
      throw new Error("Failed to fetch user");
    }

    const { message: resMessage, currentUser: user } : { message: string, currentUser: User } = await res.json();
    console.log("Login response message:", resMessage);
    setAtoken(user?.atoken || null);
    setUser(user);
  }

  async function removeUser(): Promise<void> {
    setUser(null);
    setAtoken(null);
    return;
  }

  return (
    <UserContext.Provider
      value={{
        atoken,
        currentUser: user,
        setUser: fetchUser,
        removeUser: removeUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
