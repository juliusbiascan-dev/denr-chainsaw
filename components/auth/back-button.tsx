"use client";

import Link from "next/link";

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
      variant="link"
      className={`font-normal text-[#08933D] dark:text-[#7FA8A7] hover:text-[#0C1B72] dark:hover:text-[#08933D] ${className}`}
      size="sm"
      asChild
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  );
};
