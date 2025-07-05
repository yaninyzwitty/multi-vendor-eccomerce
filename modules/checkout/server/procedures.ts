import { Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const checkoutRouter = createTRPCRouter({
    
    getProducts:
        baseProcedure
            .input(
                z.object({
                   ids: z.array(z.string())
                })
            )
            .query(async ({ ctx, input }) => {
             


            

                const data = await ctx.db.find({
                    collection: "products",
                    depth: 2, //populate image and category, tenant, tenant.image,
                    where: {
                        id: {
                            in: input.ids
                        }
                    },
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

                if(data.totalDocs !== input.ids.length) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Some products were not found"
                    })
                }

                return {
                    ...data,
                    docs: data.docs.map((doc) => ({
                        ...doc,
                        image: doc.image as Media | null,
                        tenant: doc.tenant as Tenant & {
                            image: Media | null
                        }
                    })),
                    totalPrice: data.docs.reduce((acc, product) => acc + (product.price || 0), 0),
                };
            })
});