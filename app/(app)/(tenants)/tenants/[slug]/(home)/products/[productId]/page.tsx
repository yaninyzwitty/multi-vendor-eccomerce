import { ProductView } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
    params: Promise<{
        productId: string;
        slug: string
    }>
}

export default async function ProductIdPage({ params }: PageProps) {
    const { productId, slug } = await params;
    const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({
        id: productId
    })
  );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ProductView productId={productId} tenantSlug={slug} />
        </HydrationBoundary>
    )
   
}