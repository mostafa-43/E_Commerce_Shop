import { app, db } from 'http://127.0.0.1:5500/firebase/firebase.js';
import { ref, get, child ,remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
var crudItem = document.getElementById("CrudItem")
getProductCategory('mobiles')
window.getProductCategory = getProductCategory;
window.deleteItem = deleteItem
window.editItem = editItem

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}


function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}


function getProductCategory(category) {
    showLoading()
    get(child(ref(db), `products/${category}`)).then((snapshot) => {
        hideLoading()
        crudItem.innerHTML = ""
        let data = snapshot.val()
        if (snapshot.exists()) {
            Object.entries(data).forEach(([key, product]) => {
                crudItem.innerHTML += addProductToDiv(product, key)
            });
        } else {
            hideLoading()
            crudItem.innerHTML = ""
        }
    }).catch((error) => {
        hideLoading()
        console.error("Error getting data:", error);
    })
}


function deleteItem(itemID , categoryName) {
    showLoading()
    remove(ref(db, `products/${categoryName}/${itemID}`)).then(()=>{
        hideLoading()
        alert("item deleted")
        getProductCategory(categoryName)
        console.log(categoryName);
        }).catch(()=>{
            
        })
}


async function editItem(id, imgUrl) {

    // Input elements
    const categoryInput = document.getElementById(`ProductCategory-${id}`);
    const nameInput = document.getElementById(`ProductName-${id}`);
    const descriptionInput = document.getElementById(`ProductDescription-${id}`);
    const priceInput = document.getElementById(`ProductPrice-${id}`);
    const quantityInput = document.getElementById(`ProductQuantity-${id}`);
    const imageInput = document.getElementById(`ProductImage-${id}`);

    // Alert elements
    const categoryAlert = document.getElementById(`ProductCategoryAlert-${id}`);
    const nameAlert = document.getElementById(`ProductNameAlert-${id}`);
    const descriptionAlert = document.getElementById(`ProductDescriptionAlert-${id}`);
    const priceAlert = document.getElementById(`ProductPriceAlert-${id}`);
    const quantityAlert = document.getElementById(`ProductQuantityAlert-${id}`);
    const imageAlert = document.getElementById(`ProductImageAlert-${id}`);
    //modal
    const modalEl = document.getElementById(`${id}-productEditModel`);



    function isValid() {
        let valid = true;

        // Clear previous alerts
        categoryAlert.textContent = "";
        nameAlert.textContent = "";
        descriptionAlert.textContent = "";
        priceAlert.textContent = "";
        quantityAlert.textContent = "";
        imageAlert.textContent = "";

        if (!imageInput.files[0]) {
            // No new image selected, keep old one
            imageAlert.textContent = "Same image used.";
            valid = true;
        }

        if (categoryInput.value === "default") {
            categoryAlert.textContent = "Please select a category.";
            valid = false;
        }

        if (nameInput.value.trim() === "") {
            nameAlert.textContent = "Product name is required.";
            valid = false;
        }

        if (descriptionInput.value.trim() === "") {
            descriptionAlert.textContent = "Product description is required.";
            valid = false;
        }

        if (priceInput.value.trim() === "" || isNaN(priceInput.value) || parseFloat(priceInput.value) <= 0) {
            priceAlert.textContent = "Enter a valid price greater than 0.";
            valid = false;
        }

        if (quantityInput.value.trim() === "" || isNaN(quantityInput.value) || parseInt(quantityInput.value) < 0) {
            quantityAlert.textContent = "Enter a valid quantity (0 or more).";
            valid = false;
        }

        // Validate image

        return valid;
    }
    if (!isValid()) {
        return;
    } else {
        try {
            var image = imgUrl
            if (!imageInput.files[0]) {
                image = imgUrl;
            } else {
                const file = imageInput.files[0];
                const storage = getStorage(app)
                const imgRef = storageRef(storage, `products/${categoryInput.value}/${file.name}`);
                await uploadBytes(imgRef, file);
                image = await getDownloadURL(imgRef);
            }

        } catch {
            console.log('error in upload image');

        }
        const productData = {
            category: categoryInput.value,
            name: nameInput.value.trim(),
            description: descriptionInput.value.trim(),
            price: parseFloat(priceInput.value),
            quantity: parseInt(quantityInput.value),
            image: image
        };
        showLoading()
        update(ref(db, `products/${categoryInput.value}/${id}`), productData)
            .then(() => {
                hideLoading()
                alert("Data updated successfully!");
                const modalInstance = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                modalInstance.hide();
               getProductCategory(`${categoryInput.value}`)

            })
            .catch((error) => {
                hideLoading()
                alert("Error updating data:", error);
            });


    }

}

function addProductToDiv(productData, productID) {
    let crudPtoduct = `    <div class="col-lg-4 col-md-6 col-12 d-flex">
      <div class="card shadow rounded-2 flex-fill p-3"> <!-- use padding, not margin -->
        <div class="card-body text-center">
          <img src="${productData.image}" alt="Product Image"
               class="img-fluid rounded mb-2" style="max-height:200px; object-fit:contain;">
          <p class="text-start fw-semibold fs-5 mb-1">${productData.name}</p>
          <p class="text-start showtreeline text-muted mb-1" style="height:78px; font-size:0.9rem;">${productData.description}</p>
          <p class="text-start mb-1"><strong>Price:</strong> $<span>${productData.price}</span></p>
          <p class="text-start mb-1"><strong>Quantity:</strong> <span>${productData.quantity}</span></p>
          <button type="button" class="btn btn-warning w-100 mb-1" data-bs-toggle="modal" data-bs-target="#${productID}-productEditModel">
            <i class="fa-solid fa-pencil"></i> Edit
          </button>
          <button type="button" class="btn btn-danger w-100" onclick="deleteItem('${productID}','${productData.category}')">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </div>
      </div>
    </div>
        
    <div class="modal fade" id="${productID}-productEditModel" tabindex="155,155" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-secondary text-white">
                    <h5 class="mb-0 text-center">Edit Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div class="row g-3">
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Product Category</label>
                            <select class="form-select" id="ProductCategory-${productID}">
                                <option value="default" disabled selected>-- Select Category --</option>
                                <option value="mobiles">Mobiles</option>
                                <option value="electronics">Electronics</option>
                                <option value="fashion">Fashion</option>
                            </select>
                            <small class="text-danger" id="ProductCategoryAlert-${productID}"></small>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Product Name</label>
                            <input type="text" class="form-control" id="ProductName-${productID}" placeholder="Enter product name" value="${productData.name}">
                            <small class="text-danger" id="ProductNameAlert-${productID}"></small>
                        </div>

                        <div class="col-12">
                            <label class="form-label fw-semibold">Product Description</label>
                            <textarea class="form-control" rows="3" id="ProductDescription-${productID}" placeholder="Enter product description">${productData.description}</textarea>
                            <small class="text-danger" id="ProductDescriptionAlert-${productID}"></small>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Product Price</label>
                            <input type="number" class="form-control" id="ProductPrice-${productID}" placeholder="Enter product price" value="${productData.price}">
                            <small class="text-danger" id="ProductPriceAlert-${productID}"></small>
                        </div>

                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Product Quantity</label>
                            <input type="number" class="form-control" id="ProductQuantity-${productID}" placeholder="Enter quantity" value="${productData.quantity}">
                            <small class="text-danger" id="ProductQuantityAlert-${productID}"></small>
                        </div>

                        <div class="col-12">
                            <label class="form-label fw-semibold">Product Image</label>
                            <input type="file" class="form-control" id="ProductImage-${productID}">
                            <small class="text-danger" id="ProductImageAlert-${productID}"></small>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="text-center">
                        <button id="editProductBtEdit" 
                            class="btn btn-primary px-4"
                            onclick="editItem('${productID}','${productData.image}')">
                            <i class="bi bi-plus-circle"></i> Edit Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
    return crudPtoduct
}