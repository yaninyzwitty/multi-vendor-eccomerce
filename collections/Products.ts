import { isSuperAdmin } from '@/lib/access';
import type { Tenant } from '@/payload-types';
import type { CollectionConfig } from 'payload';


export const Products: CollectionConfig = {
    slug: 'products',
    access: {
        read: () => true, 
        create: ({ req }) => {
            if(!req.user) return false;
            
            if(isSuperAdmin(req.user)) {
                return true;
            }

            if (!req.user?.tenants?.length) return false;
            const t = req.user.tenants?.[0]?.tenant as Tenant;
            if  (!t || t.stripeDetailSubmitted !== true ) return false;
            return {
                tenant: {
                    equals: t.id
                }
            }
        }

    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'description', //TODO-change to richtext
            type: 'text'
        }, 
        {
            name: 'price',
            type: 'number',
            required: true,
            admin: {
                description: "Price in USD"
            }
        }, 
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'categories',
            hasMany: false,
        },
        {
            name: 'tags',
            type: 'relationship',
            relationTo: 'tags',
            hasMany: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'refundPolicy',
            type: 'select',
            options: ["30-day", "14-day", "7-day", "3-day", "1-day", "no-refund"],
            defaultValue: "30-day",
        },
        {
            name: 'content',
            type: 'textarea', // TODO change to richtext
            admin: {
                description: "Protected content only visible to customers after purchase.Add product documentation, downloadable files, getting started guides etc."
            }
            
            
        }
    ]
}