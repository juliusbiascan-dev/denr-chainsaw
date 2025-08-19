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
    <div className={cn("w-full flex flex-col gap-y-6 items-center justify-center text-center", className)}>
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="relative">
          <Image
            src="/logo.jpg"
            alt="DENR Logo"
            width={48}
            height={48}
            className="rounded-full border-3 border-white/20 shadow-2xl sm:w-12 sm:h-12"
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-[#08933D] to-[#0C1B72] rounded-full opacity-30 blur-sm"></div>
        </div>
        <h1 className={cn(
          "text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-white/90 text-transparent bg-clip-text drop-shadow-lg",
          font.className,
        )}>
          Chainsaw Registry
        </h1>
      </div>
      <p className="text-white/90 text-sm sm:text-base max-w-sm font-medium">
        {label}
      </p>
    </div>
  );
};
