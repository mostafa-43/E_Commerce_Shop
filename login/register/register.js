import { auth, storedb as db } from '../../firebase/firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


var fname = document.getElementById("fName")
var fNameError = document.getElementById("fNameError")

var email = document.getElementById("email")
var emailError = document.getElementById("emailError")

var password = document.getElementById("password")
var passwordError = document.getElementById("passwordError")

var submitBtn = document.getElementById("submitBtn")

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
}


function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
}

submitBtn.addEventListener("click", () => {
    if (!isValid()) {
        return 0;
    } else {
        showLoading()
        createUserWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            setDoc(doc(db, "users", user.uid), {
                fullName: fname.value,

            }).then((creation) => {
                hideLoading()
                alert("user created ")
                window.location.href = "/login/login/login.html";
            }).catch((error) => {
                hideLoading()
                console.log(error);
            })
        }).catch((error) => {
            hideLoading()
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
            console.log(errorCode, errorMessage);
        });
    }
})

function isValid() {
    let check = true;
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameReg = /[a-z A-Z]{1,9}\s[a-z A-Z]{1,9}/

    fNameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";

    if (!nameReg.test(fname.value)) {
        fNameError.textContent = "Enter full name (e.g., John Doe)";
        check = false;
    }

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