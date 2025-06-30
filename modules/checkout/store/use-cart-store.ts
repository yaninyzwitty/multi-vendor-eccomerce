import { create } from 'zustand'

import { createJSONStorage, persist } from 'zustand/middleware'


interface TenantCart {
    productIds: string[];

}

interface CartState {
    tenantCarts: Record<string, TenantCart>; // object -key - tenant.cart
    addProduct: (tenantSlug: string, productId: string) => void;
    removeProduct: (tenantSlug: string, productId: string) => void;
    clearCart: (tenantSlug: string) => void;
    clearAllCarts: () => void;
    getCartByTenant: (tenantSlug: string) => string[];
}


export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            // tenant carts
            tenantCarts: {},
            addProduct(tenantSlug, productId) {
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: [...(state.tenantCarts[tenantSlug]?.productIds || []), productId]
                        }
                    }
                }))
            },
            removeProduct(tenantSlug, productId) {
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: state.tenantCarts[tenantSlug]?.productIds.filter((id) => id !== productId) || [] // filter out the productId from specific tenant cart
                        }
                    }
                }))
            },
            clearCart(tenantSlug) {
                set((state) => ({
                    tenantCarts: {
                        ...state.tenantCarts,
                        [tenantSlug]: {
                            productIds: []
                        }
                    }
                }))
            },
            clearAllCarts() {
                set({ tenantCarts: {} })
            },
            getCartByTenant(tenantSlug) {
                return get().tenantCarts[tenantSlug]?.productIds || []
            }

        }),
        {
            name: "funroad-cart",
            storage: createJSONStorage(() => localStorage)
        }
    )
)