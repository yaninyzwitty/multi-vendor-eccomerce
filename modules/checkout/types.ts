import Stripe from "stripe";

export type ProductMetadata = {
    stripeAccountId: string;
    name: string;
    price: number;
    id: string;
}

export type CheckoutMetadata =  {
    userId: string;
}

export type ExpandedLineItem = Stripe.LineItem & {
    price: Stripe.Price & {

        product: Stripe.Product & {
    
            metadata: ProductMetadata
        };
    }
}