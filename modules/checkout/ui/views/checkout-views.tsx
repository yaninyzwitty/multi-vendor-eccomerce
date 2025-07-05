"use client";

import {generateTenantUrl} from "@/lib/utils";
import {useTRPC} from "@/trpc/client";
import {useQuery} from "@tanstack/react-query";
import {InboxIcon, Loader2} from "lucide-react";
import {useEffect} from "react";
import {toast} from "sonner";
import {useCart} from "../../hooks/use-cart";
import {CheckoutItem} from "../components/checkout-item";
import {CheckoutSidebar} from "../components/checkout-sidebar";

interface Props {
  tenantSlug: string;
}
export function CheckoutView({tenantSlug}: Props) {
  const {productIds, clearAllCarts, removeProduct} = useCart(tenantSlug);
  const trpc = useTRPC();
  const {data, error, isLoading} = useQuery(
    trpc.checkout.getProducts.queryOptions({
      ids: productIds,
    })
  );

  useEffect(() => {
    if (!error) return;
    if (error.data?.code === "NOT_FOUND") {
      clearAllCarts();
      toast.warning("Some products were not found, carts cleared");
    }
  }, [error, clearAllCarts]);

  if (isLoading)
    return (
      <>
        <div className="lg:pt-16 pt-4 px-4 lg:px-12">
          <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-8 bg-white w-full rounded-lg">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="text-base font-medium">Loading...</p>
          </div>
        </div>
      </>
    );

  if (!data || data.totalDocs === 0)
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-8 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className="text-base font-medium">No products found</p>
        </div>
      </div>
    );
  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantUrl(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={`${generateTenantUrl(product.tenant.slug)}`}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice ?? 0}
            onCheckout={() => {}}
            isCanceled={false}
            isPending={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
