import { auth, storedb as db } from '../../firebase/firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { collection, getDocs, doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

var email = document.getElementById("email")
var emailError = document.getElementById("emailError")

var password = document.getElementById("password")
var passwordError = document.getElementById("passwordError")

var submitBtn = document.getElementById("submitBtn")
var CreateBtn = document.getElementById("CreateBtn")
function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}


function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}


submitBtn.addEventListener("click", () => {
    showLoading()
    if (!isValid()) {
        return 0
    } else {
        console.log("Starting Firebase login...");
        signInWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
            alert("Login successful");
            getDocs(collection(db, "admins"))
                .then((querySnapshot) => {
                    hideLoading()
                    querySnapshot.forEach((returnDoc) => {
                        if (returnDoc.data().email==userCredential.user.email){
                            console.log("admin");
                            window.location.href = `/home/admin/admin_home.html?uid=${userCredential.user.uid}`;

                        }else{
                            console.log("user");
                            window.location.href = `/home/user/user_home.html?uid=${userCredential.user.uid}`;
                        }
                    });
                })
                .catch((error) => {
                    hideLoading()
                    console.error("Error getting documents: ", error);
                });

        }).catch((error) => {
            alert(error.message);
            hideLoading()

        })
    }
})
CreateBtn.addEventListener("click", () => {
    window.location.href = "/login/register/register.html";
})
function isValid() {
    let check = true;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailError.textContent = "";
    passwordError.textContent = "";

    if (!emailReg.test(email.value)) {
        emailError.textContent = "Enter a valid email address";
        check = false;
    }

    if (password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        check = false;
    }

    return check;

}
