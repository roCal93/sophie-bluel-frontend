// Configuration de l'API
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678/api'  // URL locale pour le développement
    : 'https://sophiebluel-production-c545.up.railway.app/api'; // URL de production

// Gets the login form from the html
const form = document.querySelector('.loginForm');

// Listens when the submit button from the login form is clicked 
form.addEventListener("submit", async function (event) {
    // Block the reload of the page 
    event.preventDefault();

    // Gets the value from the input of the login form
    const formData = {
        "email": document.getElementById("email").value,
        "password": document.getElementById("pass").value
    }

    try {
        // Converts the data from the input into json
        const formDataJson = JSON.stringify(formData);

        // Sends the data to the server and retrieves the server response
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: formDataJson,
        });

        // Executes if status is ok
        if (response.status === 200) {
            // Converts the response to a javascript object 
            const data = await response.json();

            // Saves the token in localStorage (plus sécurisé que les cookies pour les tokens)
            localStorage.setItem("token", data.token);

            // Optionnel : sauvegarder aussi l'userId si retourné
            if (data.userId) {
                localStorage.setItem("userId", data.userId);
            }

            // Redirects to the home page 
            window.location.href = "./index.html";

            // Executes if status is not ok  
        } else {
            const errorData = await response.json();
            displayError(errorData.message || "E-mail ou mot de passe incorrect");
        }

        // Catches any error and displays an error message
    } catch (error) {
        console.error("Login error:", error);
        displayError("Un problème est survenu. Veuillez réessayer plus tard.");
    }
});

// Function to display an error message
function displayError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".loginForm");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.className = "error-message"; // Ajout d'une classe pour le style
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

// Fonction utilitaire pour récupérer le token
function getAuthToken() {
    return localStorage.getItem("token");
}

// Fonction pour vérifier si l'utilisateur est connecté
function isAuthenticated() {
    return !!getAuthToken();
}

// Fonction pour se déconnecter
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/FrontEnd/login.html";
}