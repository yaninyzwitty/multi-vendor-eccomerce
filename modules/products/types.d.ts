import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

export type ProductsGetManyOutput = inferRouterOutputs<AppRouter>['products']['getMany'];
export type ProductsGetSingleOutput = ProductsGetManyOutput[0];

export const sortValues = ["curated", "trending", "hot-and-new"] as const;
