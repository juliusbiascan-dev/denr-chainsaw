"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Icons } from "../icons";
import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/register";
import { PasswordInput } from "../ui/password-input";
import { Header } from "./header";
import { BackButton } from "./back-button";

const ExtendedRegisterSchema = RegisterSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface RegisterFormProps {
  token?: string | null;
  labId?: string | null;
  inviteEmail?: string | null;
  isRoot?: boolean;
}

export const RegisterForm = ({
  token,
  labId,
  inviteEmail,
  isRoot
}: RegisterFormProps) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ExtendedRegisterSchema>>({
    resolver: zodResolver(ExtendedRegisterSchema),
    defaultValues: {
      email: inviteEmail || "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ExtendedRegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data.success && labId) {
            // Update redirection path to match new structure
            window.location.href = `/teams/accept?labId=${labId}`;
          }
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <Header label="Create an account" />

      {/* Form */}
      <div className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending || !!inviteEmail}
                        placeholder="Email"
                        type="email"
                      />
                    </FormControl>
                    {inviteEmail && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        This email is from your team invitation
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        disabled={isPending}
                        placeholder="******"
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
              Create an account
            </Button>
          </form>
        </Form>
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <BackButton
          label="Already have an account?"
          href="/auth/login"
        />
      </div>
    </div>
  );
};
