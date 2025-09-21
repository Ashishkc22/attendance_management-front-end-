import Sidebar from "@/components/Sidebar";
import RouteProtector from "./RouteProtector";
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'],variable: '--font-inter', })

export const metadata = {
  title: "Dashboard",
};

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`bg-white dark:bg-black text-black dark:text-white`}
      >
        <RouteProtector>
          <div className="flex min-h-screen relative">
            <Sidebar />
            <main className="flex-1 p-2 overflow-y-auto relative">
              {children}
            </main>
          </div>
        </RouteProtector>
      </body>
    </html>
  );
}
