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
        },
        delete : ({ req }) => isSuperAdmin(req.user)

    },
    admin: {
        useAsTitle: 'name',
        description: "You must verify your account before creating products"

    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true
        },
        {
            name: 'description', 
            type: 'richText'
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
            type: 'richText', //
            admin: {
                description: "Protected content only visible to customers after purchase.Add product documentation, downloadable files, getting started guides etc."
            }
            
            
        },
        {
            name: 'isArchived',
            label: 'Archive',
            defaultValue: false,
            type: 'checkbox',
            admin:{
                description: "Check if you want to delete or hide this product"
            }
        },
        {
            name: 'isPrivate',
            label: 'Private',
            defaultValue: false,
            type: 'checkbox',
            admin:{
                description: "Check if you want to make it private"
            }
        }
      
    ]
}