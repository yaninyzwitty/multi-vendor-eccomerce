import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { z } from "zod";
import { sortValues } from "../types";
import { DEFAULT_LIMIT } from "@/modules/tags/constants";
import { headers as getHeaders } from "next/headers";

export const productsRouter = createTRPCRouter({
    getOne:
    baseProcedure
    .input(
        z.object({
            id: z.string()
        })
    ).query(async ({ ctx, input }) => {
                const headers = await getHeaders();
                const session = await ctx.db.auth({ headers });


                const product = await ctx.db.findByID({
                    collection: 'products',
                    id: input.id,
                    depth: 2, // be explicit, load product.image, product.tenant, product.tenant.image
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        image: true,
                        tenant: true,
                        category: true,
                        tags: true,
                        refundPolicy: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });
                let isPurchased = false;

                if (session.user) {
                    try {
                        // Check if user has purchased this product
                        const ordersData = await ctx.db.find({
                            collection: "orders",
                            pagination: false,
                            limit: 1,
                            where: {
                                and: [
                                    {
                                        product: {
                                            equals: input.id
                                        }
                                    },
                                    {
                                        user: {
                                            equals: session.user.id
                                        }
                                    }
                                ]
                            }
                        });

                        isPurchased = ordersData.docs && ordersData.docs.length > 0;
                    } catch (error) {
                        // Log error but don't fail the entire request
                        console.error('Error checking purchase status:', error);
                        isPurchased = false;
                    }
                }
                return {
                    ...product,
                    image: product.image as Media | null,
                    tenant: product.tenant as Tenant & {
                        image: Media | null
                    },
                    isPurchased
                };

            }),

    getMany:
        baseProcedure
            .input(
                z.object({
                    cursor: z.number().default(1),
                    limit: z.number().default(DEFAULT_LIMIT),
                    category: z.string().nullable().optional(),
                    minPrice: z.string().nullable().optional(),
                    maxPrice: z.string().nullable().optional(),
                    tags: z.array(z.string()).nullable().optional(),
                    sort: z.enum(sortValues).nullable().optional(),
                    tenantSlug: z.string().nullable().optional()
                })
            )
            .query(async ({ ctx, input }) => {

                // add sorting logic
                const where: Where = {};
                let sort: Sort = "-createdAt"
                if (input.sort === 'curated') {
                    sort = "-createdAt"
                }
                if (input.sort === 'hot-and-new') {
                    sort = "+createdAt"
                }
                if (input.sort === 'trending') {
                    sort = "-createdAt"
                }

                if (input.tenantSlug) {
                    where['tenant.slug'] = {
                        equals: input.tenantSlug
                    }
                }


                if (input.minPrice && input.maxPrice) {
                    where.price = {
                        greater_than_equal: input.minPrice,
                        less_than_equal: input.maxPrice

                    }
                } else if (input.minPrice) {
                    where.price = {
                        greater_than_equal: input.minPrice
                    }
                } else if (input.maxPrice) {
                    where.price = {
                        less_than_equal: input.maxPrice
                    }
                }

                if (input.category) {
                    const categoriesData = await ctx.db.find({
                        collection: 'categories',
                        limit: 1,
                        depth: 1, //populate subqueries,
                        pagination: false,
                        where: {
                            slug: {
                                equals: input.category
                            }
                        }
                    });


                    const formattedData = categoriesData.docs.map((doc) => {
                        return {
                            ...doc,
                            // coz of depth one
                            subcategories: (doc.subcategories?.docs ?? []).map(
                                (doc) => ({
                                    ...(doc as Category),
                                    subcategories: undefined
                                })
                            ),
                        };
                    });

                    const subCategoriesSlugs = [];
                    const parentCategory = formattedData[0];


                    if (parentCategory) {
                        subCategoriesSlugs.push(...parentCategory.subcategories.map((subcategory) => subcategory.slug))

                        where['category.slug'] = {
                            in: [parentCategory.slug, ...subCategoriesSlugs]
                        }

                    }


                }

                if (input.tags && input.tags.length > 0) {
                    where['tags.name'] = {
                        in: input.tags
                    }
                }


                const data = await ctx.db.find({
                    collection: "products",
                    depth: 2, //populate image and category, tenant, tenant.image,
                    where,
                    sort,
                    page: input.cursor,
                    limit: input.limit,
                    // Explicitly select all fields to ensure price is included
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        image: true,
                        tenant: true,
                        category: true,
                        tags: true,
                        refundPolicy: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });



                return {
                    ...data,
                    docs: data.docs.map((doc) => ({
                        ...doc,
                        image: doc.image as Media | null,
                        tenant: doc.tenant as Tenant & {
                            image: Media | null
                        }
                    }))
                };
            })
});