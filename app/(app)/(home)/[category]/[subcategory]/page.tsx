import {ProductListView} from "@/modules/products/ui/views/product-list-view";
import {getQueryClient, trpc} from "@/trpc/server";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
interface SubCategoryPageProps {
  params: Promise<{subcategory: string}>;
  searchParams: Promise<{
    minPrice: string | undefined;
    maxPrice: string | undefined;
    tags: string[] | null;
  }>;
}
export default async function SubCategoryPage({
  params,
  searchParams,
}: SubCategoryPageProps) {
  const {subcategory} = await params;
  const {maxPrice, minPrice, tags} = await searchParams;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
      maxPrice,
      minPrice,
      tags,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}
