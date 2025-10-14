// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <-- CORRECT IMPORT PATH
import { Toaster } from "react-hot-toast";
import { ReduxProvider } from "@/redux/reduxProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description: "Manage your personal portfolio content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: "#161B22",
                color: "#C9D1D9",
                border: "1px solid #30363D",
              },
            }}
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
