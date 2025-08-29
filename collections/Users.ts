import type { CollectionConfig } from 'payload'
import {  tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from '@/lib/access'


const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    update: ({ req }) => isSuperAdmin(req.user),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user), // only if is super admin
    update: ({ req }) => isSuperAdmin(req.user),
  },


 
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user),
    // allow user to modify themself
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) {
        return true;
      }

      return req.user?.id === id; // update urself
    }


  },
  admin: {
    useAsTitle: 'email',
    hidden: ({user  }) => !isSuperAdmin(user)// only admins can see users
  },
  auth: {
    // cookies: {
    //   sameSite: 'None',
    //   domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
    //   secure: process.env.NODE_ENV === 'production',
    // }
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'username',
      required: true,
      unique: true,
      type: 'text'
    },
    {
      admin: {
        position: 'sidebar'
      },
      name: 'roles',
      type: 'select',
      options: ['super-admin', 'user'],
      defaultValue: ['user'],
      access: {
        update: ({ req }) => isSuperAdmin(req.user)

      },
      hasMany: true,
    },
   {
    ...defaultTenantArrayField,
    admin: {
      ...(defaultTenantArrayField?.admin  || {} ),
      position: 'sidebar'
    }
   }


  ],
}
