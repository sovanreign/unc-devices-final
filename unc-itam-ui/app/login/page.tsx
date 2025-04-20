import Image from "next/image";
import { LoginForm } from "./components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 space-y-6">
      {/* Logo + School Name */}
      <div className="flex flex-col items-center gap-2">
        <Image
          src="/unc-logo-only.png" // ← Make sure the logo is in the public folder
          alt="UNC Logo"
          width={50}
          height={50}
        />
        <h2 className="text-sm text-muted-foreground text-center font-medium">
          University of Nueva Caceres
        </h2>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
