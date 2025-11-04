import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package2 } from "lucide-react";
import type { ReactNode } from "react";

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Package2 className="h-5 w-5" />
              </div>
              <span className="font-medium text-base tracking-tight">
                Mini Products
              </span>
            </Link>

            <Button asChild>
              <Link href="/products" scroll={false}>
                + Add product
              </Link>
            </Button>
          </div>
          {children}
        </div>
        {modal}
        <Toaster />
      </body>
    </html>
  );
}
