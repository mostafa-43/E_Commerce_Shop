import { app, db } from "http://127.0.0.1:5500/firebase/firebase.js";
import {ref,get,child,update} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

let tabBody = document.getElementById("tableBody");


window.updateOrderStatus = updateOrderStatus;
window.getProductCategory = getProductCategory;

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
}
function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}


function getProductCategory(hideAfter = true) {
  showLoading(); 

  get(child(ref(db), `orders`))
    .then((snapshot) => {
      tabBody.innerHTML = "";
      let data = snapshot.val();

      if (snapshot.exists()) {
        Object.entries(data).forEach(([key, product]) => {
          tabBody.innerHTML += showOrders(product , key);
        });
      } else {
        console.log("No data found");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      if (hideAfter) hideLoading(); 
    });
}


getProductCategory();


function showOrders(order , key) {
  let rowClass = "";
  if (order.status === "Accepted") {
    rowClass = "table-success";
  } else if (order.status === "Rejected") {
    rowClass = "table-danger";
  }

  return `
<tr class="${rowClass}">
  <td>${key}</td>
  <td>${order.customerName}</td>
  <td>${order.customerID}</td>
  <td>${order.date}</td>
  <td>${order.status}</td>
  <td>${order.total}</td>
  <td>${order.quantity}</td>
  <td>${order.address}</td>
  <td>
    <button class="btn btn-success btn-sm" onclick="updateOrderStatus('${key}', 'Accepted')">Accept</button>
    <button class="btn btn-danger btn-sm" onclick="updateOrderStatus('${key}', 'Rejected')">Reject</button>
  </td>
</tr>`;
}


function updateOrderStatus(orderId, newStatus) {
  showLoading(); 

  const orderRef = ref(db, `orders/${orderId}`);
  update(orderRef, { status: newStatus })
    .then(() => {
      console.log(`Order ${orderId} updated to ${newStatus}`);

      getProductCategory(false);
    })
    .catch((error) => {
      console.error("Error updating order:", error);
    })
    .finally(() => {
      hideLoading();
    });
}
