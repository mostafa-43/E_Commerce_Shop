import { db } from 'http://127.0.0.1:5500/firebase/firebase.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";


const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");
const cartRef = ref(db, `carts/${userId}`);

async function getAllOrders() {
    try {
        const snapshot = await get(ref(db, `orders`)); 
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("📦 All orders:", data);

            const orders = [];
            for (const userKey in data) {
                for (const orderId in data[userKey]) {
                    orders.push({
                        userId: userKey,
                        id: orderId,
                        ...data[userKey][orderId]
                    });
                }
            }
            console.log("Orders as Array:", orders);
            return orders;
        } else {
            console.log("No orders found");
            return [];
        }
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
}
getAllOrders().then(orders => {
    console.log("✅ Final Orders:", orders);
});




const ordersContainer = document.getElementById("orders-container");
const loadingDiv = document.getElementById("loading-orders");
const noOrdersDiv = document.getElementById("no-orders-message");

async function loadUserOrders(userId) {
    try {
        const snapshot = await get(ref(db, "orders"));
        loadingDiv.style.display = "none";

        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("📦 Raw Orders Data:", data);

            const orders = Object.keys(data)
                .map(orderId => ({
                    id: orderId,
                    ...data[orderId]
                }))
                .filter(order => order.customerID === userId); 

            if (orders.length === 0) {
                noOrdersDiv.style.display = "block";
                return;
            }

            ordersContainer.style.display = "block";
            renderOrders(orders);
        } else {
            noOrdersDiv.style.display = "block";
        }
    } catch (error) {
        console.error("❌ Error loading orders:", error);
        loadingDiv.style.display = "none";
        noOrdersDiv.style.display = "block";
    }
}

loadUserOrders(userId);

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
document.addEventListener("DOMContentLoaded", () => {
  if (userId) {
    updateCartCount();
  }
});


function renderOrders(orders) {
    ordersContainer.innerHTML = "";

    orders.forEach(order => {
       

        const card = `
            <div class="card order-card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="card-title">Order #${order.id}</h5>
                        <span class="order-status bg-success text-white">${order.status || "pending"}</span>
                    </div>
                    <p class="card-text mb-1"><strong>Customer:</strong> ${order.customerName}</p>
                    <p class="card-text mb-1"><strong>Address:</strong> ${order.address}</p>
                    <p class="card-text mb-1"><strong>Date:</strong> ${order.date}</p>
                    <p class="card-text mb-3"><strong>Total:</strong> ${order.total || 0} EGP</p>
                    
                </div>
            </div>
        `;
        ordersContainer.innerHTML += card;
    });
}

loadUserOrders(userId);

document.addEventListener("DOMContentLoaded", () => {
  const cartLink = document.getElementById("cart-link");
  if (cartLink && userId) {
    cartLink.href = `../cart/cart.html?userId=${encodeURIComponent(userId)}`;
  }
});


//1
// const itemsArray = Array.isArray(order.items) 
// ? order.items 
//             : Object.values(order.items || {});

// const itemsHtml = itemsArray.length > 0
//     ? itemsArray.map(item => {
//         const name = item.name || item.productName || "Unnamed";
//         const image = item.image || item.productImage || "https://via.placeholder.com/60";
//         const qty = item.quantity || item.qty || 0;
//         const price = item.price || 0;

//         return `
//             <div class="d-flex align-items-center mb-2">
//                 <img src="${image}" class="order-img me-2" width="60" height="60">
//                 <div>
//                     <h6 class="mb-0">${name}</h6>
//                     <small class="text-muted">Qty: ${qty} × ${price} EGP</small>
//                 </div>
//             </div>
//         `;
//     }).join("")
//     : "<p class='text-muted'>No items</p>";

//2
{/* <div>${itemsHtml}</div> */}