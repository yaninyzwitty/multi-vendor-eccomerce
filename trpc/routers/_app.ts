import { authRouter } from '@/modules/auth/server/procedures';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { productsRouter } from '@/modules/products/server/procedures';
import { tagsRouter } from '@/modules/tags/server/procedures';
import { createTRPCRouter } from '../init';
import { tenantsRouter } from '@/modules/tenants/server/procedures';
import { checkoutRouter } from '@/modules/checkout/server/procedures';
import { libraryRouter } from '@/modules/library/server/procedures';
import { reviewsRouter } from '@/modules/reviews/server/procedures';
export const appRouter = createTRPCRouter({
 categories: categoriesRouter,
 auth: authRouter,
 products: productsRouter,
 tags: tagsRouter,
 tenants: tenantsRouter,
 checkout: checkoutRouter,
 library: libraryRouter,
 reviews: reviewsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;