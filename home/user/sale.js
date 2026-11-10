var bestSellerSection =document.getElementById('sale');
const productData = [
{
    category: "men clothing",
        name: "hoodie",
        description:"Sed do eiusmod tempor incididunt",
        price:"$180.00",
        quantity: "38",
        image: "assets/img/product/product-5.webp"
},
{
    category: "men clothing",
        name: "hoodie",
        description:"Sed do eiusmod tempor incididunt",
        price:"$180.00",
        quantity: "38",
        image: "assets/img/product/product-11.webp"
},
{
    category: "men clothing",
        name: "hoodie",
        description:"Sed do eiusmod tempor incididunt",
        price:"$180.00",
        quantity: "38",
        image: "assets/img/product/product-10.webp"
},
{
    category: "men clothing",
        name: "hoodie",
        description:"Sed do eiusmod tempor incididunt",
        price:"$180.00",
        quantity: "38",
        image: "assets/img/product/product-3.webp"
}
];

for (let i = 0; i < productData.length; i++) {
bestSellerSection.innerHTML+=add(productData[i]);
function add (value){
var x = `<div class="col-lg-3 col-md-6">
        <div class="product-item">
            <div class="product-image">
            <img src=${value.image} alt="Product Image" class="img-fluid" loading="lazy">
            <div class="product-actions">
            </div>
            <button class="cart-btn">Add to Cart</button>
            </div>
            <div class="product-info">
            <div class="product-category">${value.category}</div>
            <div class="product-category">${value.name}</div>
            <h4 class="product-name"><a href="product-details.html">${value.description}</a></h4>
            <span class="rating-count">Quantity : ${value.quantity}</span>
            <div class="product-rating">
                <div class="stars">
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-fill"></i>
                <i class="bi bi-star-half"></i>
                
                </div>
            </div>
            <div class="product-price">
                <span class="old-price">$240.00</span>
                <span class="current-price">${value.price}</span>
            </div>

            </div>
        </div>
        </div>`
        return x
}

}
