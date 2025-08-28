import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import ReviewForm, {ReviewSkeleton} from "./review-form";
import {Suspense} from "react";

interface Props {
  productId: string;
}
export function ReviewSidebar({productId}: Props) {
  const trpc = useTRPC();
  const {data} = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return (
    <Suspense fallback={<ReviewSkeleton />}>
      <ReviewForm productId={productId} initialData={data} />
    </Suspense>
  );
}
