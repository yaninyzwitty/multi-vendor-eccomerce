"use client";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import {ArrowLeft} from "lucide-react";
import Link from "next/link";
import {ReviewSidebar} from "../../../reviews/ui/components/review-sidebar";
import {RichText} from "@payloadcms/richtext-lexical/react";
import {Skeleton} from "@/components/ui/skeleton";

interface Props {
  productId: string;
}
export function ProductView({productId}: Props) {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  console.log(data.description);

  return (
    <div className="min-h-screen bg-white">
      <nav className="p-4 bg-[#f4f4f0] w-full border-b">
        <Link href={`/library`} prefetch className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <span className="text-sm font-medium">Back to Library</span>
        </Link>
      </nav>
      <header className="bg-[#f4f4f0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 ">
          <h1 className="text-[40px] font-medium">{data.name}</h1>
        </div>
      </header>

      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          <div className="lg:col-span-2">
            <div className="p-4 bg-white border gap-4 rounded-md">
              <ReviewSidebar productId={productId} />
            </div>
          </div>
          <div className="lg:col-span-5">
            {data.content ? (
              <RichText data={data.content} className="prose" />
            ) : (
              <p className="font-medium italic text-muted-foreground">
                No special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

interface ProductViewSkeletonProps {
  showSidebar?: boolean;
}

export function ProductViewSkeleton({
  showSidebar = true,
}: ProductViewSkeletonProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* top nav */}
      <nav className="p-4 bg-[#f4f4f0] w-full border-b">
        <Link href={`/library`} prefetch className="flex items-center gap-2">
          <ArrowLeft className="size-4" />
          <Skeleton className="h-4 w-32" />
        </Link>
      </nav>

      {/* header title */}
      <header className="bg-[#f4f4f0] py-8 border-b">
        <div className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12">
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>
      </header>

      {/* content */}
      <section className="max-w-(--breakpoint-xl) mx-auto px-4 lg:px-12 flex flex-col gap-y-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          {showSidebar && (
            <div className="lg:col-span-2">
              <div className="p-4 bg-white border gap-4 rounded-md space-y-3">
                <Skeleton className="h-6 w-40" />
                {Array.from({length: 4}).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-full" />
                ))}
              </div>
            </div>
          )}

          {/* main rich text area */}
          <div className="lg:col-span-5 space-y-3">
            {Array.from({length: 6}).map((_, i) => (
              <Skeleton
                key={i}
                className={`h-4 rounded-md ${i % 2 === 0 ? "w-11/12" : "w-full"}`}
              />
            ))}
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
