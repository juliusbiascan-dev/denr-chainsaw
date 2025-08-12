"use client";

import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/form-error";

export const ErrorCard = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "Oops! Something went wrong!";

  if (error === "Configuration") {
    errorMessage = "There was a problem with the server configuration.";
  }

  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <FormError message={errorMessage} />
    </CardWrapper>
  );
};
