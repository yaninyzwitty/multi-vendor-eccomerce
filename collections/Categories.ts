import { isSuperAdmin } from '@/lib/access';
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig =  {
    slug: 'categories',
      access: {
        read: () => true,
        create: ({ req }) => isSuperAdmin(req.user),
        update: ({ req }) => isSuperAdmin(req.user),
        delete: ({ req }) => isSuperAdmin(req.user),
      },
    
    admin: {
        useAsTitle: 'name',
    hidden: ({user  }) => !isSuperAdmin(user)// only admins can see categories collection

    },
    fields: [
        {
        name: 'name',
        type: 'text',
        required: true
        },
        {
        name: 'slug',
        type: 'text',
        required: true,
        unique: true,
        index: true
            
        }, {
            name: 'color',
            type: 'text'
        },
        {
            name: 'parent',
            type: 'relationship',
            relationTo: 'categories' as never,
            hasMany: false,
        }, {
            name: 'subcategories',
            type: 'join',
            collection: 'categories' as never,
            on: 'parent',
            hasMany: true
        }
    ]
}