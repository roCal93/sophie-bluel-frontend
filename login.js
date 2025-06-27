// Use shared config (Option A) or rename variable (Option B)
// Option A: Remove API_URL declaration and use shared config
const { API_URL } = window.AppConfig;

// Option B: Uncomment this line instead if not using shared config
// const LOGIN_API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5678/api' : 'https://sophiebluel-production-c545.up.railway.app/api';

// Gets the login form from the html - use ID selector
const form = document.querySelector('#loginForm');

// Check if form exists
if (!form) {
    console.error('Login form not found!');
}

// Listens when the submit button from the login form is clicked 
form?.addEventListener("submit", async function (event) {
    // Block the reload of the page 
    event.preventDefault();

    // Clear any existing error messages
    clearError();

    // Gets the value from the input of the login form
    const formData = {
        "email": document.getElementById("email").value.trim(),
        "password": document.getElementById("pass").value
    };

    // Basic validation
    if (!formData.email || !formData.password) {
        displayError("Veuillez remplir tous les champs.");
        return;
    }

    try {
        // Converts the data from the input into json
        const formDataJson = JSON.stringify(formData);

        // Sends the data to the server and retrieves the server response
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            body: formDataJson,
        });

        // Executes if status is ok
        if (response.status === 200) {
            // Converts the response to a javascript object 
            const data = await response.json();

            // Saves the token in localStorage
            localStorage.setItem("token", data.token);

            // Optionally save userId if returned
            if (data.userId) {
                localStorage.setItem("userId", data.userId);
            }

            console.log("✅ Login successful, redirecting...");

            // Redirects to the home page - adjust path as needed
            window.location.href = "./index.html";

        } else if (response.status === 401) {
            displayError("E-mail ou mot de passe incorrect");
        } else if (response.status === 404) {
            displayError("Utilisateur non trouvé");
        } else {
            const errorData = await response.json().catch(() => ({}));
            displayError(errorData.message || "Erreur lors de la connexion");
        }

    } catch (error) {
        console.error("Login error:", error);
        displayError("Un problème est survenu. Veuillez réessayer plus tard.");
    }
});

// Function to display an error message
function displayError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        const popup = document.querySelector("#loginForm");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.className = "error-message";
        spanErrorMessage.style.color = "red";
        spanErrorMessage.style.display = "block";
        spanErrorMessage.style.marginTop = "10px";
        spanErrorMessage.innerText = message;
        popup.appendChild(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

// Function to clear error messages
function clearError() {
    const errorMessage = document.getElementById("errorMessage");
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Utility function to get the token
function getAuthToken() {
    return localStorage.getItem("token");
}

// Function to check if user is authenticated
function isAuthenticated() {
    return !!getAuthToken();
}

// Function to logout
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("projects"); // Clear cached projects too

    // Adjust path based on your file structure
    const loginPath = window.location.pathname.includes('/FrontEnd/')
        ? '/FrontEnd/login.html'
        : './login.html';

    window.location.href = loginPath;
}

// Auto-redirect if already logged in
if (isAuthenticated() && window.location.pathname.includes('login.html')) {
    console.log("User already logged in, redirecting...");
    window.location.href = "./index.html";
}