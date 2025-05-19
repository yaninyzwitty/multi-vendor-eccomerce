import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
    getMany:
        baseProcedure
            .query(async ({ ctx }) => {

                // const db = ctx.db;


                const data = await ctx.db.find({
                collection: "categories",
                depth: 1, //populate subqueries,
                pagination: false,
                where: {
                    parent: {
                    exists: false,
                    },
                },
                sort: "name",

                });

                const formattedData = data.docs.map((doc) => {
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

                return formattedData;               
            })
});