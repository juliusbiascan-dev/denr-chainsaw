"use client";

import { useSearchParams } from "next/navigation";
import { FormError } from "@/components/form-error";
import { Header } from "./header";
import { BackButton } from "./back-button";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Oops! Something went wrong!";

  if (error === "Configuration") {
    errorMessage = "There was a problem with the server configuration.";
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <Header label="Oops! Something went wrong!" />

      {/* Error Content Container with Glassmorphism */}
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 shadow-2xl p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-center min-h-[120px]">
            <FormError message={errorMessage} />
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <BackButton
          label="Back to login"
          href="/auth/login"
        />
      </div>
    </div>
  );
};
