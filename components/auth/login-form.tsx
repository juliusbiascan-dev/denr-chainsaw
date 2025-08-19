"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
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
import { login } from "@/actions/login";
import { Icons } from "../icons";
import { PasswordInput } from "../ui/password-input";
import { Header } from "./header";
import { BackButton } from "./back-button";
import { Social } from "./social";
import React from "react";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            // Force a page refresh after successful login to ensure session is updated
            setTimeout(() => {
              window.location.href = callbackUrl || '/dashboard';
            }, 1000);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch((e) => {
          // Ignore NEXT_REDIRECT errors as they are part of successful login
          if (e.message && e.message.includes("NEXT_REDIRECT")) {
            return; // This is actually a successful login
          }

          setError("Something went wrong");
        });
    });
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Header */}
      <Header label="Welcome back" />

      {/* Form Container with Glassmorphism */}
      <div className="backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 shadow-2xl p-8">
        <div className="space-y-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                {showTwoFactor && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-medium">Two Factor Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="123456"
                            className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:border-white/60 rounded-lg shadow-sm h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {!showTwoFactor && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isPending}
                              placeholder="Email"
                              type="email"
                              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:border-white/60 rounded-lg shadow-sm h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white font-medium">Password</FormLabel>
                          <FormControl>
                            <PasswordInput
                              {...field}
                              disabled={isPending}
                              placeholder="******"
                              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:border-white/60 rounded-lg shadow-sm h-12"
                            />
                          </FormControl>
                          <Button
                            size="sm"
                            variant="link"
                            asChild
                            className="px-0 font-normal text-white/80 hover:text-white"
                          >
                            <Link href="/auth/reset">
                              Forgot password?
                            </Link>
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              <FormError message={error || urlError} />
              <FormSuccess message={success} />

              <Button
                disabled={isPending}
                type="submit"
                className="w-full bg-gradient-to-r from-[#08933D] to-[#0C1B72] hover:from-[#0C1B72] hover:to-[#08933D] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-out shadow-lg hover:shadow-xl h-12"
              >
                {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {showTwoFactor ? "Confirm" : "Login"}
              </Button>
            </form>
          </Form>

          {/* Social Login */}
          {/* {!showTwoFactor && <Social />} */}
        </div>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <BackButton
          label="Don't have an account?"
          href="/auth/register"
        />
      </div>
    </div>
  );
};
