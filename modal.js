// Sets modal
let modal = null
// Defines the focusable element
const focusableSelector = "button, a, input, textarea"
// Creates an array for the focusable 
let focusables = []
// Sets previouslyFocusedElement
let previouslyFocusedElement = null

// Opens the modal 
function openModal(e) {
    e.preventDefault()
    // Trouve le lien modal (celui qui a l'attribut href)
    const modalLink = e.target.closest('.aModalLink')
    // Retrieves the id of the modal
    modal = document.querySelector(modalLink.getAttribute("href"))
    // Retrieves all focusable elements of the modal in an array
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    // Saves the last element of the homepage that has focus
    previouslyFocusedElement = document.querySelector(":focus")
    // Displays the modal
    modal.style.display = "flex"

    // Sets the focus to the first element
    focusables[0].focus()

    // Makes the modal visible for an accessibility API
    modal.removeAttribute("aria-hidden")
    // The aria-modal attribute indicates whether an element is modal when displayed.
    modal.setAttribute("aria-modal", "true")
    // Closes the modal when a click hapens outside the modal
    modal.addEventListener("click", closeModal)
    // Closes the modal when the cross is clicked 
    modal.querySelector(".closeModal").addEventListener("click", closeModal)
    // Does not close the modal when a click happens inside the modal
    modal.querySelector(".modalStop").addEventListener("click", stopPropagation)
}

// NOUVELLE FONCTION : Initialise le contenu SEULEMENT quand la modal s'ouvre
function initializeModalContentOnOpen() {
    // Récupère les projets depuis localStorage
    let projects = window.localStorage.getItem("projects");
    if (projects) {
        projects = JSON.parse(projects);

        // Nettoie le contenu existant
        const titleModal = document.getElementById("titleModal");
        const divContent = document.querySelector(".modalContent");
        const btnModalContent = document.querySelector(".btnModalContent");

        titleModal.innerHTML = "";
        divContent.innerHTML = "";
        btnModalContent.innerHTML = "";

        // Appelle vos fonctions existantes
        addPhotoBtnModal();
        displayProjectsModal(projects);
    }
}

// Reste du code modal.js inchangé...
function closeModal(e) {
    if (modal === null) return
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".closeModal").removeEventListener("click", closeModal)
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation)
    modal = null
    const photoBtnModal = document.querySelector(".photoBtnModal")
    if (photoBtnModal && photoBtnModal.style.display === "none") {
        const arrowLeft = document.querySelector(".fa-arrow-left")
        if (arrowLeft) arrowLeft.click()
    }
}

function stopPropagation(e) {
    e.stopPropagation()
}

function focusInModal(e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}

document.addEventListener('click', function (e) {
    const modalLink = e.target.closest('.aModalLink')
    if (modalLink) {
        openModal(e);
    }
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})