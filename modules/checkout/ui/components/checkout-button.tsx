import {useCart} from "../../hooks/use-cart";
import {Button} from "@/components/ui/button";
import {generateTenantUrl, cn} from "@/lib/utils";
import {ShoppingCartIcon} from "lucide-react";
import Link from "next/link";

interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty: boolean;
  tenantSlug: string;
}
export function CheckoutButton({
  hideIfEmpty,
  tenantSlug,
  className,
}: CheckoutButtonProps) {
  const {totalItems} = useCart(tenantSlug);

  if (hideIfEmpty && totalItems == 0) return null;

  return (
    <Button asChild variant={"elevated"} className={cn("bg-white", className)}>
      <Link href={`${generateTenantUrl(tenantSlug)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
}
