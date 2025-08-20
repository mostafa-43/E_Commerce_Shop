 import { app ,db } from 'http://127.0.0.1:5500/firebase/firebase.js';
import {ref, child, get, push } 
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { onValue } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("productId");
const CatName = urlParams.get("CatName");
const userId = urlParams.get("userId");
let cartRef = null;

if (userId) {
  cartRef = ref(db, `carts/${userId}`);
}

function listenToCartCount() {
  if (!cartRef) return; //  اخرج لو مفيش userId

  onValue(cartRef, (snapshot) => {
    if (snapshot.exists()) {
      const cart = snapshot.val();
      const totalCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
      document.getElementById("cart-count").textContent = totalCount;
    } else {
      document.getElementById("cart-count").textContent = 0;
    }
  });
}
let currentProduct = null;
get(child(ref(db), "products/mobiles/2025-08-16T10-00-00")).then((snapshot) => { 
  console.log(snapshot.val());
  })


async function loadProduct() {
  if (!productId) {
    alert("No product id provided");
    return;
  }

  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `products/${CatName}/${productId}`));

  if (snapshot.exists()) {
    const product = snapshot.val();
      currentProduct = {
      id: productId,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: CatName
    };
    document.getElementById("product-name").textContent = product.name;
    document.getElementById("product-description").textContent = product.description;
    document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
    document.querySelector(".product-img").src = product.image;
    document.querySelector(".product-img").alt = product.name;
  } else {
    alert("Product not found");
  }
}


document.addEventListener("DOMContentLoaded", () => {
   listenToCartCount();
  loadProduct();

  const qtyInput = document.getElementById("product-qty");
  const decreaseBtn = document.getElementById("decrease-qty");
  const increaseBtn = document.getElementById("increase-qty");

  decreaseBtn.addEventListener("click", () => {
    let value = parseInt(qtyInput.value);
    if (value > 1) {
      qtyInput.value = value - 1;
    }
  });

  increaseBtn.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  });


  
    // Adding to cart func
  document.getElementById("add-to-cart").addEventListener("click", async () => {
    if (!currentProduct) {
      alert("Product not loaded yet!");
      return;
    }

   
    const qty = parseInt(qtyInput.value);

    const cartItem = {
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      qty: qty,
      image: currentProduct.image
    };

    try {
      await push(ref(db, `carts/${userId}`), cartItem);
      alert(`${qty} x ${currentProduct.name} added to cart.`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    }
  });




  
});

document.addEventListener("DOMContentLoaded", () => {
  const ordersLink = document.getElementById("orders-link");
  if (ordersLink && userId) {
    ordersLink.href = `../orders/orders.html?userId=${encodeURIComponent(userId)}`;
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const cartLink = document.getElementById("cart-link");
  if (cartLink && userId) {
    cartLink.href = `../cart/cart.html?userId=${encodeURIComponent(userId)}`;
  }
});

