import { Poppins } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
  className?: string;
}

export const Header = ({
  label,
  className,
}: HeaderProps) => {
  return (
    <div className={cn("w-full flex flex-col gap-y-4 items-center justify-center", className)}>
      <div className="flex items-center space-x-3">
        <Image
          src="/logo.jpg"
          alt="DENR Logo"
          width={48}
          height={48}
          className="rounded-full border-2 border-[#08933D] shadow-md"
        />
        <h1 className={cn(
          "text-3xl font-bold bg-gradient-to-r from-[#08933D] to-[#0C1B72] text-transparent bg-clip-text",
          font.className,
        )}>
          Chainsaw Registry
        </h1>
      </div>
      <p className="text-[#7FA8A7] text-sm">
        {label}
      </p>
    </div>
  );
};
