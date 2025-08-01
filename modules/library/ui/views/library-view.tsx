import React, {Suspense} from "react";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {ProductList, ProductListSkeleton} from "../components/product-list";

export function LibraryView() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#f4f4f0] w-full border-b">
        <Link href={`/`} className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <span className="text-sm font-medium">Continue Shopping</span>
        </Link>
      </nav>
      <header className="bg-[#f4f4f0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4">
          <h1 className="text-[40px] font-medium">Library</h1>
          <p className="font-medium">Your purchases and reviews</p>
        </div>
      </header>

      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4 py-10">
        {/* load products library view */}
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList />
        </Suspense>
      </section>
    </div>
  );
}
