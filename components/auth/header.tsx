import { Poppins } from "next/font/google";
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
    <div className={cn("w-full flex flex-col gap-y-4 items-center justify-center text-center", className)}>
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-[#08933D] to-[#0C1B72] rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className={cn(
          "text-2xl font-bold text-gray-900 dark:text-white",
          font.className,
        )}>
          Chainsaw Registry
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm">
        {label}
      </p>
    </div>
  );
};
