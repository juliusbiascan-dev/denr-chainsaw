import Image from "next/image";
const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="flex flex-col min-h-screen relative">

      {/* Content wrapper */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Navigation placeholder */}
        <nav className="h-[72px]">

        </nav>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-8 py-16">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;