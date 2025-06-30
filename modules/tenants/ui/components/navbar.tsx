"use client";

// import {CheckoutButton} from "@/modules/checkout/ui/components/checkout-button";
import {generateTenantUrl} from "@/lib/utils";
import {useTRPC} from "@/trpc/client";
import {useSuspenseQuery} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {useParams} from "next/navigation";
import React from "react";

import dynamic from "next/dynamic";
import {Button} from "@/components/ui/button";
import {ShoppingCartIcon} from "lucide-react";

const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),

  {
    ssr: false,
    loading: () => (
      <Button disabled className="bg-white">
        <ShoppingCartIcon className="text-black" />
      </Button>
    ),
  }
);

export function Navbar() {
  const trpc = useTRPC();
  const params = useParams();
  const {data} = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({
      slug: params.slug as string,
    })
  );

  return (
    <nav className="h-20 border-b bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <Link
          href={generateTenantUrl(params.slug as string)}
          className="flex items-center gap-2"
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              alt={params.slug as string}
              width={32}
              height={32}
              className="rounded-full shrink-0 size-[32px]"
            />
          )}
          <p className="text-xl">{data.name}</p>
        </Link>
        <div className="flex items-center gap-2">
          <CheckoutButton hideIfEmpty tenantSlug={params.slug as string} />
        </div>
      </div>
    </nav>
  );
}

export function NavbarSkeleton() {
  return (
    <nav className="h-20 border-b bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12">
        <div />
        <Button disabled className="bg-white">
          <ShoppingCartIcon className="text-black" />
        </Button>
      </div>
    </nav>
  );
}
