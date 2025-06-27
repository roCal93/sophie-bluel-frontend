// Wait for DOM to be fully loaded before checking token
document.addEventListener('DOMContentLoaded', function () {
    checkTokenExists();
});

function checkTokenExists() {
    // Checks in localStorage if the token exists
    if (localStorage.getItem("token")) {
        changeLoginIntoLogoutBtn();
        addEditionBanner();
        removeFilterAndAddModifyBtn();
    }
}

// Function that changes the login button into a logout button and deletes the token when clicked
function changeLoginIntoLogoutBtn() {
    const logout = document.querySelector(".logout");

    if (logout) {
        logout.innerHTML = "logout";
        logout.href = "#";
        // Deletes the token from localStorage when the "logout" button is clicked
        logout.addEventListener("click", function (e) {
            e.preventDefault(); // Prevent default link behavior
            // Remove token and userId from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.reload();
        });
    } else {
        console.error("Logout element not found");
    }
}

// Function that creates an editing banner under the header
function addEditionBanner() {
    const editionBanner = document.querySelector("html");
    const childHeader = document.querySelector("body");
    const divEdition = document.createElement("div");
    let contenant = `<a class="aModalLink" href="#modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a>`;
    divEdition.innerHTML = contenant;
    divEdition.classList = "editionBanner";
    // Inserts the banner at the top of the body not at the end
    editionBanner.insertBefore(divEdition, childHeader)
}

// Function that removes filters and adds a button to edit projects
function removeFilterAndAddModifyBtn() {
    const filters = document.querySelector(".filters")
    if (filters) {
        filters.remove();
    }

    const titleMargin = document.querySelector(".adminMargin");
    if (titleMargin) {
        titleMargin.style.margin = '0em 1em 3em 0em';
    }

    const parentModifyLink = document.getElementById("portfolio");
    const modifyLink = document.createElement("div");
    const childGallery = document.querySelector(".gallery")
    let contenant = `<a class="aModalLink" href="#modal"><i class="fa-regular fa-pen-to-square"></i>modifier</a>`;
    modifyLink.innerHTML = contenant;
    modifyLink.classList.add("modifyLink")
    // Gets the link at the top of the portfolio section
    if (parentModifyLink && childGallery) {
        parentModifyLink.insertBefore(modifyLink, childGallery)
        // Puts the link and the title in the same div
        if (titleMargin) {
            modifyLink.appendChild(titleMargin)
        }
    }
}