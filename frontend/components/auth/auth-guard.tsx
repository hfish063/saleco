"use client";

import { useState } from "react";
import { Customer } from "@/app/api/customer";
import LoginForm from "./login-form";

type AuthGuardProps = {
  customers: Customer[];
  children: React.ReactNode;
};

export default function AuthGuard({ customers, children }: AuthGuardProps) {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <LoginForm customers={customers} onLogin={() => setLoggedIn(true)} />;
  }

  return <>{children}</>;
}
