
loadPage("add_product/add.html", "add_product/add.js")
// loadPage("edit_product/edit.html", "edit_product/edit.js")

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".sidenav a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            let value = this.dataset.value;
            console.log("Clicked:", value);
            document.querySelectorAll(".sidenav a").forEach(a => a.classList.remove("active"));
            switch (value) {
                case "add":
                    loadPage("add_product/add.html", "add_product/add.js")
                    console.log("add");
                    this.classList.add("active")
                    break;
                case "edit":
                    loadPage("edit_product/edit.html", "edit_product/edit.js")
                    // page = "edit_product/edit.html";
                    console.log("edit");
                    this.classList.add("active")
                    break;
                case "out":
                    loadPage("out_product/out_product.html", "out_product/out_product.js")
                    console.log("out");
                    this.classList.add("active")
                    break;
                case "orders":
                    loadPage("order_product/order_product.html", "order_product/order_product.js")
                    console.log("order");
                    this.classList.add("active")
                    break;
                case "logout":
                    window.location.replace("http://127.0.0.1:5500/login/login/login.html");
                    return;
            }
        });
    });
});
function loadPage(page, scriptPath) {
    fetch(page)
        .then(res => res.text())
        .then(html => {
            const main = document.querySelector(".main");
            main.innerHTML = html;
            const oldScript = document.getElementById("dynamic-page-script");
            oldScript.remove()
            if (scriptPath) {
                const newScript = document.createElement("script");
                newScript.type = "module";
                newScript.src = scriptPath + "?v=" + Date.now();
                newScript.id = "dynamic-page-script";
                document.body.appendChild(newScript);
                console.log("New script added:", scriptPath);
            }
        })
        .catch(err => console.error("Error loading page:", err));
}
