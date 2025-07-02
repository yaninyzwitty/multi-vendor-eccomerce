import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
    const {  addProduct, removeProduct, clearCart, clearAllCarts, getCartByTenant } = useCartStore();

    // get all product ids from that tenant
    const productIds = getCartByTenant(tenantSlug)

    // toggle product in cart (remove | add)

    const toggleProduct = (productId: string) => {
        if (productIds.includes(productId)) {
            removeProduct(tenantSlug, productId)
        } else {
            addProduct(tenantSlug, productId)
        }
    };

    const isProductInCart = (productId: string) => {
        return productIds.includes(productId)
    };

    // clear tenant cart
    const clearTenantCart = () => {
        clearCart(tenantSlug)
    }


    return {
        productIds,
        addProduct: (productId: string) => addProduct(tenantSlug, productId),
        removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
        clearCart: clearTenantCart,
        clearAllCarts,
        toggleProduct,
        isProductInCart,
        totalItems: productIds.length,
        // isEmpty: productIds.length === 0
    }


}