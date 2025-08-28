import React from "react";
import {Poppins} from "next/font/google";
import {cn} from "@/lib/utils";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export function Footer() {
  return (
    <nav className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto gap-2 flex py-6 items-center h-full px-4 lg:px-12">
        <p className="">Powered by</p>
        <Link href={`${process.env.NEXT_PUBLIC_APP_URL!}`}>
          <span className={cn(`text-2xl font-semibold`, poppins.className)}>
            funroad
          </span>
        </Link>
      </div>
    </nav>
  );
}
