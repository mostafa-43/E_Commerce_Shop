
import { app, db } from '../../firebase/firebase.js';
import { ref, get, child ,remove } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";
import { update } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";
function getProductCategory(category) {
        
        get(child(ref(db), `products/electronics`)).then((snapshot) => {
        
        menCaregoryone.innerHTML = ""
        let data = snapshot.val()
        if (snapshot.exists()) {
                Object.entries(data).forEach(([key, product]) => {
                //هنا هتكتب الفانكشن الي بتجيب الداتا
                menCaregoryone.innerHTML+=add(product,key);
                });
        } else {
                menCaregoryone.innerHTML = ""
        }
        }).catch((error) => {
        
        console.error("Error getting data:", error);
        })
}
        window.gotodetails=gotodetails
        getProductCategory()
        var menCaregoryone =document.getElementById('menCaregoryone');
        // const productData = [
        // {
        //         category: "Women's Fashion",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },{
        //         category: "Women's Fashion",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "Women's Fashion",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "Women's Fashion",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        // {
        //         category: "men clothing",
        //         name: "hoodie",
        //         description:"Sed do eiusmod tempor incididunt",
        //         price:"$180.00",
        //         quantity: "38",
        //         image: "mob3.png"
        // },
        
        // ];

        // for (let i = 0; i < productData.length; i++) {
        // menCaregoryone.innerHTML+=add(productData[i]);
        function gotodetails(id,category) {
                console.log(id,category)
        }
        function add (value,id){
                var x = `<div class="col-6 col-xl-4">
                        <div class="product-card" data-aos="zoom-in">
                                <div class="product-image">
                                <img src=${value.image} class="main-image img-fluid" alt="Product">
                                <img src="mob.jpg" class="hover-image img-fluid" alt="Product Variant">
                                <div class="product-overlay">
                                <div class="product-actions">
                                <button onclick="gotodetails('${id}','${value.category}')" type="button" class="action-btn" data-bs-toggle="tooltip" title="Quick View">
                                        <i class="bi bi-eye"></i>
                                </button>
                                <button type="button" class="action-btn" data-bs-toggle="tooltip" title="Add to Cart">
                                        <i class="bi bi-cart-plus"></i>
                                </button>
                                </div>
                                </div>
                                </div>
                                <div class="product-details">
                                <div class="product-category">${value.category}</div>
                                <h4 class="product-title"><a href="product-details.html">${value.name}</a></h4>
                                <h6 class="product-title"><a href="product-details.html">${value.description}</a></h6>
                                <div class="product-meta">
                                <div class="product-price">${value.price}</div>
                                <div class="product-rating">
                                <i class="bi bi-bag-check-fill" style="color: black;"></i>${value.quantity}
                                </div>
                                </div>
                                </div>
                        </div>
                        </div>`
                return x
        }
        // }

