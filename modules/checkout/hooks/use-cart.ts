import { useCallback } from "react";
import { useCartStore } from "../store/use-cart-store";
import {useShallow} from "zustand/shallow";

export const useCart = (tenantSlug: string) => {

    const addProduct = useCartStore((state) => state.addProduct);
    const removeProduct = useCartStore((state) => state.removeProduct);
    const clearCart = useCartStore((state) => state.clearCart);
    const clearAllCarts = useCartStore((state) => state.clearAllCarts);
    
    // get all product ids from that tenant
    const productIds = useCartStore(useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || []));

    // toggle product in cart (remove | add)

    const toggleProduct = useCallback((productId: string) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId)
        } else {
            addProduct(tenantSlug, productId)
        }
    }, [tenantSlug, productIds, addProduct, removeProduct]);

    const isProductInCart = useCallback((productId: string) => {
        return productIds.includes(productId)
    }, [productIds]);

    // clear tenant cart
    const clearTenantCart = useCallback(() => {
        clearCart(tenantSlug)
    }, [tenantSlug, clearCart]);


    const handleAddProduct = useCallback((productId: string) => {
         addProduct(tenantSlug, productId)

    }, [tenantSlug, addProduct]);

    const handleRemoveProduct = useCallback((productId: string) => {
         removeProduct(tenantSlug, productId)

    }, [tenantSlug, removeProduct]);




    return {
        productIds,
        addProduct: handleAddProduct,
        removeProduct: handleRemoveProduct,
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductInCart,
        totalItems: productIds.length,
        // isEmpty: productIds.length === 0
    }


}