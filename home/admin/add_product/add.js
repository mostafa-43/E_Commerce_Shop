

//#region import
import { app } from 'http://127.0.0.1:5500/firebase/firebase.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";

import { getDatabase, ref as dbRef, set } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
//#endregion

//#region Inputs
var ProductCategory = document.getElementById("ProductCategory");
var ProductName = document.getElementById("ProductName");
var ProductDescription = document.getElementById("ProductDescription");
var ProductPrice = document.getElementById("ProductPrice");
var ProductQuantity = document.getElementById("ProductQuantity");
var ProductImage = document.getElementById("ProductImage");
var addProductBtn = document.getElementById("addProductBtn");
//#endregion

//#region Alerts
var ProductCategoryAlert = document.getElementById("ProductCategoryAlert");
var ProductNameAlert = document.getElementById("ProductNameAlert");
var ProductDescriptionAlert = document.getElementById("ProductDescriptionAlert");
var ProductPriceAlert = document.getElementById("ProductPriceAlert");
var ProductQuantityAlert = document.getElementById("ProductQuantityAlert");
var ProductImageAlert = document.getElementById("ProductImageAlert");
//#endregion
function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}


function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}

var adminID = "khaled2001hassan@gmail.com"
const storage = getStorage(app)
const database = getDatabase(app);
addProductBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!isValid()) {
        return 0
    } else {
showLoading()
try {

            const file = ProductImage.files[0]; 
            const imgRef = storageRef(storage, `products/${ProductCategory.value}/${file.name}`);
            await uploadBytes(imgRef, file);
            const imageUrl = await getDownloadURL(imgRef);
            console.log("Image URL:", imageUrl);
            console.log("data add success");
            const productData = {
                category: ProductCategory.value,
                name: ProductName.value.trim(),
                description: ProductDescription.value.trim(),
                price: parseFloat(ProductPrice.value),
                quantity: parseInt(ProductQuantity.value),
                image: imageUrl
            };
            let key = new Date().toISOString().replace(/[.#$\[\]/]/g, "-");
            await set(dbRef(database, `products/${ProductCategory.value}/${key}`), productData);
            alert("data add success");
            hideLoading()
            
        }
        catch {
            console.log("data not added success");
            hideLoading()
        }
    }
})

function isValid() {

    let valid = true;
    ProductCategoryAlert.textContent = "";
    ProductNameAlert.textContent = "";
    ProductDescriptionAlert.textContent = "";
    ProductPriceAlert.textContent = "";
    ProductQuantityAlert.textContent = "";
    ProductImageAlert.textContent = "";

    if (ProductCategory.value === "default") {
        ProductCategoryAlert.textContent = "Please select a category.";
        valid = false;
    }

    if (ProductName.value.trim() === "") {
        ProductNameAlert.textContent = "Product name is required.";
        valid = false;
    }

    if (ProductDescription.value.trim() === "") {
        ProductDescriptionAlert.textContent = "Product description is required.";
        valid = false;
    }

    if (ProductPrice.value.trim() === "" || isNaN(ProductPrice.value) || parseInt(ProductPrice.value) <= 0) {
        ProductPriceAlert.textContent = "Enter a valid price greater than 0.";
        valid = false;
    }

    if (ProductQuantity.value.trim() === "" || isNaN(ProductQuantity.value) || parseInt(ProductQuantity.value) < 0) {
        ProductQuantityAlert.textContent = "Enter a valid quantity (0 or more).";
        valid = false;
    }

    // Product Image
    if (!ProductImage.files[0]) {
        ProductImageAlert.textContent = "Please choose a product image.";
        valid = false;
    }

    return valid;
}
// upload() 
// function upload() {
//   const data = {
//     "products": {
//       "mobiles": {
//         "2025-08-16T10-00-00": {
//           "category": "mobiles",
//           "name": "Samsung Galaxy S24",
//           "description": "Sleek and powerful smartphone with advanced camera features.",
//           "price": 799.99,
//           "quantity": 5,
//           "image": "https://picsum.photos/id/1025/500/500"
//         },
//         "2025-08-16T11-00-00": {
//           "category": "mobiles",
//           "name": "iPhone 15 Pro",
//           "description": "Apple’s latest model with cutting-edge design and performance.",
//           "price": 1199.99,
//           "quantity": 8,
//           "image": "https://picsum.photos/id/1011/500/500"
//         },
//         "2025-08-16T14-00-00": {
//           "category": "mobiles",
//           "name": "Google Pixel 9",
//           "description": "Pure Android experience with an outstanding camera.",
//           "price": 999.99,
//           "quantity": 6,
//           "image": "https://picsum.photos/id/1044/500/500"
//         }
//       },
//       "electronics": {
//         "2025-08-16T12-00-00": {
//           "category": "laptops",
//           "name": "Dell XPS 15",
//           "description": "High-end laptop with stunning OLED display and powerful internals.",
//           "price": 1599.99,
//           "quantity": 5,
//           "image": "https://picsum.photos/id/1005/500/500"
//         },
//         "2025-08-16T13-00-00": {
//           "category": "laptops",
//           "name": "MacBook Air M3",
//           "description": "Lightweight MacBook with Apple’s efficient M3 chip.",
//           "price": 1299.99,
//           "quantity": 12,
//           "image": "https://picsum.photos/id/100/500/500"
//         },
//         "2025-08-16T14-30-00": {
//           "category": "laptops",
//           "name": "HP Spectre x360",
//           "description": "Convertible laptop with premium design and performance.",
//           "price": 1399.99,
//           "quantity": 7,
//           "image": "https://picsum.photos/id/1041/500/500"
//         }
//       },
//       "fashion": {
//         "2025-08-16T15-00-00": {
//           "category": "fashion",
//           "name": "Leather Jacket",
//           "description": "Stylish and warm, perfect for winter wear.",
//           "price": 199.99,
//           "quantity": 20,
//           "image": "https://picsum.photos/id/1027/500/500"
//         },
//         "2025-08-16T15-30-00": {
//           "category": "fashion",
//           "name": "Running Shoes",
//           "description": "Comfortable and durable for everyday running.",
//           "price": 99.99,
//           "quantity": 30,
//           "image": "https://picsum.photos/id/103/500/500"
//         },
//         "2025-08-16T16-00-00": {
//           "category": "fashion",
//           "name": "Smart Watch",
//           "description": "Fashionable watch with fitness tracking features.",
//           "price": 249.99,
//           "quantity": 15,
//           "image": "https://picsum.photos/id/1042/500/500"
//         }
//       }
//     }
//   };

//   async function uploadProducts(database) {
//     for (const category in data.products) {
//       for (const productKey in data.products[category]) {
//         const p = data.products[category][productKey];

//         const productData = {
//           category: p.category,
//           name: p.name.trim(),
//           description: p.description.trim(),
//           price: parseFloat(p.price),
//           quantity: parseInt(p.quantity),
//           image: p.image
//         };

//         const key = productKey;

//         await set(
//           dbRef(database, `products/${category}/${key}`),
//           productData
//         );

//         console.log(`Uploaded: ${p.name}`);
//       }
//     }
//   }

//   const database = getDatabase();
//   uploadProducts(database)
//     .then(() => console.log("All products uploaded!"))
//     .catch(err => console.error("Upload failed", err));
// }


