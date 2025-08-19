import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/ThemeToggle/theme-toggle";

const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="h-screen w-full">
      <ScrollArea className="h-full w-full">
        <div className="min-h-screen flex">
          {/* Left Column - Brand/Info Section */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#08933D] to-[#0C1B72] items-center justify-center p-8">
            <div className="max-w-md text-center text-white">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4">DENR Chainsaw Registry</h1>
                <p className="text-xl text-white/90">
                  Register your chainsaw for legal use, compliance, and responsible forest management
                </p>
              </div>
              <div className="space-y-4 text-white/80">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Secure equipment tracking</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Legal compliance management</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Online registration portal</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <span>Government-approved system</span>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm text-white/70">
                  For inquiries: cenroalaminos@denr.gov.ph
                </p>
                <p className="text-sm text-white/70">
                  Contact: 09852390811
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Form */}
          <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 flex items-center justify-center p-8 relative">
            {/* Back Button */}
            <Link href="/" className="absolute top-6 left-6 z-10">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>

            {/* Theme Toggle */}
            <div className="absolute top-6 right-6 z-10">
              <ModeToggle />
            </div>

            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AuthLayout;