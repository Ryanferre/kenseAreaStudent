// layouts/ProtectedLayout.tsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
