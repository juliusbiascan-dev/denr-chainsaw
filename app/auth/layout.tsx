import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-screen w-full">
      <ScrollArea className="h-full w-full">
        <div className="min-h-screen relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/tropical_forest_landscape_bg.jpg"
              alt="Tropical Forest Background"
              fill
              className="object-cover"
              priority
            />
            {/* Overlay for better readability */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#08933D]/20 via-transparent to-[#0C1B72]/20"></div>
          </div>

          {/* Content wrapper */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Navigation placeholder */}
            <nav className="h-16 sm:h-20"></nav>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-8 sm:py-16">
              <div className="w-full max-w-md">
                {children}
              </div>
            </div>

            {/* Footer */}
            <footer className="py-6 text-center">
              <p className="text-white/80 text-sm font-medium">
                © 2025 DENR Chainsaw Registry. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AuthLayout;