// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Orders } from './collections/Orders'
import { Products } from './collections/Products'
import { Tags } from './collections/Tags'
import { Tenants } from './collections/Tenant'
import { Config } from './payload-types'
import { Reviews } from './collections/Reviews'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants, Orders, Reviews],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    multiTenantPlugin<Config>({
      collections: {
        products: {}

      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants(user) {
        return Boolean(user?.roles?.includes('super-admin'))
      },
    }),
    payloadCloudPlugin(),

    // storage-adapter-placeholder
  ],
})
