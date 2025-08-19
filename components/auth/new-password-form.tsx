"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Icons } from "../icons";
import { PasswordInput } from "../ui/password-input";

import { NewPasswordSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { newPassword } from "@/actions/new-password";
import { Header } from "./header";
import { BackButton } from "./back-button";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <Header label="Enter a new password" />

      {/* Form Container with Glassmorphism */}
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 shadow-2xl p-8">
        <div className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white font-medium">New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:border-white/60 rounded-lg shadow-sm h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-gradient-to-r from-[#08933D] to-[#0C1B72] hover:from-[#0C1B72] hover:to-[#08933D] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl h-12"
              >
                {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Reset password
              </Button>
            </form>
          </Form>
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
