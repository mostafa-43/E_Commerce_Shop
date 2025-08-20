import { app,db  } from 'http://127.0.0.1:5500/firebase/firebase.js';
import { ref, get, child, update, remove,set, push } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");
// const auth = getAuth();
// let userId = null; 
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     userId = user.uid;
//     console.log("✅ Logged in as:", user.email, "UID:", userId);
//   } else {
//     userId = null;
//     console.log("❌ No user logged in");
//   }
// });

const cartRef = ref(db, `carts/${userId}`);

async function debugDatabase() {
  const snapshot = await get(ref(db));
  console.log("Root data:", snapshot.val());
}
debugDatabase();

async function displayCartItems22() {
  try {
    const snapshot = await get(cartRef);
    if (!snapshot.exists()) {
      console.log("Cart is empty or wrong path");
      return;
    }

    const data = snapshot.val();
    console.log("Cart snapshot:", data);

    for (const key in data) {
      console.log("Item:", data[key]); 
    }
  } catch (err) {
    console.error("Error loading cart:", err);
  }
}


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

// updateOrderSummary
async function updateOrderSummary() {
  const snapshot = await get(cartRef);
  if (snapshot.exists()) {
    const cart = snapshot.val();
    const cartItems = Object.values(cart);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0); 
    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
  }
}

// displayCartItems
async function displayCartItems() {
  const snapshot = await get(cartRef);
  const cartItemsContainer = document.getElementById("cart-items-container");

  cartItemsContainer.innerHTML = "";

  if (snapshot.exists()) {
    const cart = snapshot.val();
    Object.entries(cart).forEach(([itemId, item]) => {
      const itemHTML = `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
          <div class="d-flex align-items-center">
            <img src="${item.image}" alt="${item.name}" width="50" height="50" class="me-2">
            <div>
              <p class="mb-0">${item.name}</p>
              <small class="text-muted">$${item.price}</small>
            </div>
          </div>
          <div>
            <input type="number" value="${item.qty}" min="1" class="form-control form-control-sm d-inline-block w-50 me-2" 
              onchange="updateCartItemQty('${itemId}', this.value)">
            <button class="btn btn-sm btn-danger" onclick="removeCartItem('${itemId}')">Remove</button>
          </div>
          <div>
            <span class="fw-bold">$${(item.price * item.qty).toFixed(2)}</span>
          </div>
        </div>
      `;
      cartItemsContainer.innerHTML += itemHTML;
    });
  } else {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  }

   await updateOrderSummary();
  await updateCartCount();
}

window.updateCartItemQty = async (itemId, newQty) => {
  const itemRef = child(cartRef, itemId);
  await update(itemRef, { qty: parseInt(newQty) }); 
  await displayCartItems();
  await updateCartCount();
};

window.removeCartItem = async (itemId) => {
  const itemRef = child(cartRef, itemId);
  await remove(itemRef);
  await displayCartItems();
  await updateCartCount();
  await updateOrderSummary();
};

document.addEventListener("DOMContentLoaded", async () => {
  await displayCartItems();
  await updateCartCount();
});


document.getElementById("checkout-btn").addEventListener("click", async () => {
  const fullname = document.getElementById("fullname").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullname || !address || !phone) {
    alert("Please fill all fields before checkout.");
    return;
  }

  // displayCartItem
  const snapshot = await get(cartRef);
  if (!snapshot.exists()) {
    alert("Your cart is empty!");
    return;
  }

  const cartItems = Object.values(snapshot.val());
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const quantity = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // mak id
  const newOrderRef = push(ref(db, "orders"));
  const orderId = newOrderRef.key;

  const today = new Date();
  const orderDate = today.toISOString().split("T")[0];

  const order = {
    id: orderId,
    customerName: fullname,
    customerID: userId,
    phone: phone,
    date: orderDate,
    status: "pending",
    total,
    quantity,
    address
    //items: cartItems
  };

  try {
    await set(newOrderRef, order);
    await remove(ref(db, `carts/${userId}`));
    alert("✅ Order placed successfully and cart cleared!");
    //updateCartCount();
      await updateOrderSummary();
      await updateCartCount();
  } catch (err) {
    console.error("Error placing order:", err);
    alert("❌ Failed to place order.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ordersLink = document.getElementById("orders-link");
  if (ordersLink && userId) {
    ordersLink.href = `../orders/orders.html?userId=${encodeURIComponent(userId)}`;
  }
});


