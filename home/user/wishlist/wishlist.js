import { app, db } from '../../firebase/firebase.js';
import { ref, get, child, update, remove, set, push } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

const wishlistRef = ref(db, `wishlists/${userId}`);
const cartRef = ref(db, `carts/${userId}`);

// Update wishlist count in navbar
async function updateWishlistCount() {
    const snapshot = await get(wishlistRef);
    if (snapshot.exists()) {
        const wishlist = snapshot.val();
        const totalCount = Object.keys(wishlist).length;
        document.getElementById("wishlist-count").textContent = totalCount;
    } else {
        document.getElementById("wishlist-count").textContent = 0;
    }
}

// Update cart count in navbar
async function updateCartCount() {
    const snapshot = await get(cartRef);
    if (snapshot.exists()) {
        const cart = snapshot.val();
        const totalCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
        document.getElementById("cart-count").textContent = totalCount;
    } else {
        document.getElementById("cart-count").textContent = 0;
    }
}

// Display wishlist items
async function displayWishlistItems() {
    const snapshot = await get(wishlistRef);
    const wishlistItemsContainer = document.getElementById("wishlist-items-container");

    wishlistItemsContainer.innerHTML = "";

    if (snapshot.exists()) {
        const wishlist = snapshot.val();
        Object.entries(wishlist).forEach(([itemId, item]) => {
            const itemHTML = `
                <div class="card mb-3 shadow-sm">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <img src="${item.image}" alt="${item.name}" class="wishlist-item-img">
                            </div>
                            <div class="col-md-4">
                                <h6 class="mb-1">${item.name}</h6>
                                <small class="text-muted">${item.category || 'General'}</small>
                            </div>
                            <div class="col-md-2">
                                <h5 class="mb-0 text-primary">$${item.price}</h5>
                            </div>
                            <div class="col-md-4 text-end">
                                <button class="btn btn-sm btn-primary me-2" onclick="addToCart('${itemId}', '${item.name}', ${item.price}, '${item.image}')">
                                    <i class="bi bi-cart-plus"></i> Add to Cart
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeFromWishlist('${itemId}')">
                                    <i class="bi bi-trash"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            wishlistItemsContainer.innerHTML += itemHTML;
        });

        // Update summary
        await updateWishlistSummary();
        document.getElementById("empty-wishlist-message").style.display = "none";
    } else {
        wishlistItemsContainer.innerHTML = "<p class='text-center text-muted'>Your wishlist is empty.</p>";
        document.getElementById("empty-wishlist-message").style.display = "block";
        document.getElementById("wishlist-total-items").textContent = "0";
        document.getElementById("wishlist-total-value").textContent = "$0.00";
    }
}

// Update wishlist summary
async function updateWishlistSummary() {
    const snapshot = await get(wishlistRef);
    if (snapshot.exists()) {
        const wishlist = snapshot.val();
        const items = Object.values(wishlist);
        
        const totalItems = items.length;
        const totalValue = items.reduce((sum, item) => sum + item.price, 0);

        document.getElementById("wishlist-total-items").textContent = totalItems;
        document.getElementById("wishlist-total-value").textContent = `$${totalValue.toFixed(2)}`;
    }
}

// Add item to cart from wishlist
window.addToCart = async (itemId, name, price, image) => {
    try {
        const cartItemRef = child(cartRef, itemId);
        const existingItem = await get(cartItemRef);
        
        if (existingItem.exists()) {
            const currentQty = existingItem.val().qty || 0;
            await update(cartItemRef, { qty: currentQty + 1 });
        } else {
            await set(cartItemRef, {
                name: name,
                price: price,
                image: image,
                qty: 1
            });
        }

        // Remove from wishlist after adding to cart
        await removeFromWishlist(itemId);
        
        showToast("Item added to cart and removed from wishlist");
        await updateCartCount();
        await displayWishlistItems();
    } catch (err) {
        console.error("Error adding to cart:", err);
        showToast("Error adding item to cart", "danger");
    }
};

// Remove item from wishlist
window.removeFromWishlist = async (itemId) => {
    try {
        const itemRef = child(wishlistRef, itemId);
        await remove(itemRef);
        showToast("Item removed from wishlist");
        await displayWishlistItems();
        await updateWishlistCount();
    } catch (err) {
        console.error("Error removing from wishlist:", err);
        showToast("Error removing item", "danger");
    }
};

// Add all items to cart
document.getElementById("add-all-to-cart-btn").addEventListener("click", async () => {
    try {
        const snapshot = await get(wishlistRef);
        if (!snapshot.exists()) {
            showToast("Wishlist is empty", "warning");
            return;
        }

        const wishlist = snapshot.val();
        
        for (const [itemId, item] of Object.entries(wishlist)) {
            const cartItemRef = child(cartRef, itemId);
            const existingItem = await get(cartItemRef);
            
            if (existingItem.exists()) {
                const currentQty = existingItem.val().qty || 0;
                await update(cartItemRef, { qty: currentQty + 1 });
            } else {
                await set(cartItemRef, {
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    qty: 1
                });
            }
        }

        // Clear wishlist after adding all to cart
        await remove(wishlistRef);
        showToast("All items added to cart and wishlist cleared");
        await updateCartCount();
        await displayWishlistItems();
    } catch (err) {
        console.error("Error adding all to cart:", err);
        showToast("Error adding items to cart", "danger");
    }
});

// Clear entire wishlist
document.getElementById("clear-wishlist-btn").addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear your entire wishlist?")) {
        try {
            await remove(wishlistRef);
            showToast("Wishlist cleared");
            await displayWishlistItems();
            await updateWishlistCount();
        } catch (err) {
            console.error("Error clearing wishlist:", err);
            showToast("Error clearing wishlist", "danger");
        }
    }
});

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    
    toast.className = `toast align-items-center text-white bg-${type}`;
    toastMessage.textContent = message;
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
    await displayWishlistItems();
    await updateWishlistCount();
    await updateCartCount();
});
