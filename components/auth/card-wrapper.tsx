"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  headerComponent?: React.ReactNode;
  showSocial?: boolean;
  backButtonLabel: string
  backButtonHref: string
};

export const CardWrapper = ({
  children,
  headerLabel,
  headerComponent,
  showSocial,
  backButtonLabel,
  backButtonHref,
}: CardWrapperProps) => {
  return (
    <Card className="w-[95%] sm:w-[400px] shadow-xl rounded-2xl overflow-hidden border-2 border-[#08933D]/10 dark:border-[#7FA8A7]/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-[#181A20]">
      <CardHeader className="space-y-3 bg-gradient-to-b from-[#DDE5E1] to-[#DDE5E1]/90 dark:from-[#23272F] dark:to-[#23272F]/90 p-4 sm:p-6">
        {headerComponent || <Header label={headerLabel} />}
      </CardHeader>
      <CardContent className="p-4 sm:p-6 bg-white dark:bg-[#181A20]">
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter className="bg-[#DDE5E1]/50 dark:bg-[#23272F]/50 p-4 border-t border-[#7FA8A7]/20 dark:border-[#7FA8A7]/30">
          <Social />
        </CardFooter>
      )}
      <CardFooter className="bg-[#DDE5E1]/30 dark:bg-[#23272F]/30">
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};
