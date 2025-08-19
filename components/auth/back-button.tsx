"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({
  href,
  label,
  className,
}: BackButtonProps) => {
  if (!href || !label) return null;
  return (
    <Button
      variant="ghost"
      className={`group flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${className}`}
      size="sm"
      asChild
    >
      <Link href={href}>
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {label}
      </Link>
    </Button>
  );
};
