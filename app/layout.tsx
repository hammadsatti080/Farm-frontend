import Navbar from "@/Component/Navbar";
import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
          <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid #3b82f6",
            },
          }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}