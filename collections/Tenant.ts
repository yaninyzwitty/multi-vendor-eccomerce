import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'slug',
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      required: true,
      type: 'text',
      label: 'Store Name',
      admin: {
        description: 'This is the name of the store (e.g. "The Coffee Shop")',
      },
    },
    {
      name: 'slug',
      required: true,
      type: 'text',
      index: true,
      unique: true,
      label: 'Store Slug',
      admin: {
        description: 'This is the subdomain of the store (e.g. "[slug].funroad.com")',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Store Logo',
    },
    {
        name: 'StripeAccountId',
        type: 'text',
        required: true,
        admin: {
            readOnly: true
        }
    }, {
        name: 'stripeDetailSubmitted' , 
        type: 'checkbox',
        defaultValue: false,
        label: 'Stripe Details Submitted',
        admin: {
            readOnly: true,
            description: 'This is a flag to indicate if the stripe details have been submitted'
        }
    }

  ],
}
