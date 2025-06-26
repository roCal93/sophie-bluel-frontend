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
    // Retrieves the id of the modal
    modal = document.querySelector(e.target.getAttribute("href"))
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

// Closes the modal
function closeModal(e) {
    // If the modal is closed this function doesn't happen
    if (modal === "none") return
    // Puts the focus to the last element focused before the modal was displayed
    if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
    e.preventDefault()
    // Undisplays the modal
    modal.style.display = "none"
    // Hides the modal for an accessibility API
    modal.setAttribute("aria-hidden", "true")
    // Removes the aria-modal attribute
    modal.removeAttribute("aria-modal")
    // Deletes the eventListener that closes the modal when a click happens outside
    modal.removeEventListener("click", closeModal)
    // Deletes the eventListener that closes the modal when a click happens on the cross
    modal.querySelector(".closeModal").removeEventListener("click", closeModal)
    // Deletes the eventListener that doesn't close the modal when a click happens inside the modal
    modal.querySelector(".modalStop").removeEventListener("click", stopPropagation)
    // Resets the modal
    modal = null
    // Returns the modal to the first part 
    if (document.querySelector(".photoBtnModal").style.display === "none") {
        document.querySelector(".fa-arrow-left").click()
    }
}

// Function that stops the propagation of an event
function stopPropagation(e) {
    e.stopPropagation()
}

// Function that allows to navigate in a loop in the modal
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

// Gets links that open the modal and stock it in an array 
const modalLink = Array.from(document.querySelectorAll(".aModalLink"))

// Starts the openModal function when a click happens on links
for (let i = 0; i < modalLink.length; i++) {
    modalLink[i].addEventListener("click", openModal)
}

// Closes the modal when the escape key is down or focus on the modal if the tab key is down and the modal is displayed
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})


