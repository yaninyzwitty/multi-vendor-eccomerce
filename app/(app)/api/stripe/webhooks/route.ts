import config from "@payload-config";
import type { Stripe } from "stripe";

import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

export async function POST(request: Request) {
   
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            await ((await request.blob()).text()),
            request.headers.get("stripe-signature") || "",
            process.env.STRIPE_WEBHOOK_SECRET || ""
        )
        
    } catch (error) {
        return new Response(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
            status: 400,        
        });
        
    }

    console.log("Received Stripe event:", event.id, event.type);

    const permittedEvents: string[] = [
        "checkout.session.completed",
        "account.updated"
    ];


    const payload = await getPayload({ config });

    if (permittedEvents.includes(event.type)) {
        let data;
        try {
            switch (event.type) {
                case "checkout.session.completed":
                    data = event.data.object as Stripe.Checkout.Session;

                    if(!data.metadata?.userId) {
                        throw new Error("User ID is required")
                    };

                    const user = await payload.findByID({
                        collection: "users",
                        id: data.metadata.userId 
                    });

                    if(!user) {
                        throw new Error("User not found!")
                    }

                    const expandedSession = await stripe.checkout.sessions.retrieve(data.id, { expand: ['line_items.data.price.product']}, {stripeAccount: event.account });
                    if(!expandedSession.line_items?.data || !expandedSession.line_items.data.length) {
                        throw new Error('No line items found')
                    };

                    const lineItems = expandedSession.line_items.data as ExpandedLineItem[]

                    for (const item of lineItems) {
                        await payload.create({
                            collection: 'orders',
                            data: {
                                stripeCheckoutSessionId: data.id,
                                user: user.id,
                                product: item.price.product.metadata.id,
                                name: item.price.product.name,
                                stripeAccountId: event.account


                            }
                        })
                        
                    };
                    
                    break;
                case "account.updated":
                    data = event.data.object as Stripe.Account;

                    await payload.update({
                        collection: 'tenants',
                        where: {
                            StripeAccountId: {
                                equals: data.id
                            }
                        },
                        data: {
                            stripeDetailSubmitted: data.details_submitted,
                        }
                    })
                    break;
                default:
                    throw new Error(`Unhandled event: ${event.type}`)


            }
        } catch (error) {
            console.log(error);
            return NextResponse.json({ message: "Webhook handler failed"}, { status: 500 })            
        }
    }

    return NextResponse.json({ message: "Received"}, { status: 200 })

    


}