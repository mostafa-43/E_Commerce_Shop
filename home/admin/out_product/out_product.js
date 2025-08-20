import { app } from "http://127.0.0.1:5500/firebase/firebase.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const db = getFirestore(app);

const makeAdminForm = document.getElementById("makeAdminForm");
const statusMsg = document.getElementById("statusMsg");

makeAdminForm.addEventListener("click", async (e) => {
  e.preventDefault(); 

  const email = document.getElementById("userEmail").value.trim();

  if (!email) {
    statusMsg.textContent = "Please enter an email.";
    statusMsg.style.color = "red";
    return;
  }

  try {
    console.log("Saving:", email);

    await addDoc(collection(db, "admins"), {
      email: email,
      role: "admin",
      createdAt: new Date()
    });

    statusMsg.textContent = `${email} saved as admin in Firestore.`;
    statusMsg.style.color = "lightgreen";
    console.log("Saved successfully");
  } catch (err) {
    console.error("Error:", err);
    statusMsg.textContent = "Error saving admin.";
    statusMsg.style.color = "red";
  }

  makeAdminForm.reset();
});



