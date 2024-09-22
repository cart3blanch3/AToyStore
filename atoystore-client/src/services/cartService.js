const CART_KEY = 'cartItems';

// Helper function to get the cart from localStorage
const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
};

// Helper function to save the cart to localStorage
const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

// Add item to the cart
export const addToCart = (cartItem) => {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);

    if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        // Add new item
        cart.push(cartItem);
    }

    saveCart(cart);
};

// Get all cart items
export const getCartItems = () => {
    return getCart();
};

// Update item quantity
export const updateCartItemQuantity = (id, quantity) => {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex >= 0) {
        if (quantity > 0) {
            cart[itemIndex].quantity = quantity;
        } else {
            // If quantity is 0 or less, remove the item
            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
    }
};

// Remove item from the cart
export const removeCartItem = (id) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
};

export const clearCart = () => {
    localStorage.removeItem('cartItems'); // Удаляем элементы корзины из localStorage
};
