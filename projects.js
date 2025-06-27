
/////////////////////////////////////////////// Configuration API ////////////////////////////////////////////////////////////////////////////

// Configuration de l'API - détecte automatiquement l'environnement
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5678/api'
    : 'https://sophiebluel-production-c545.up.railway.app/api';

/////////////////////////////////////////////// Project Homepage ////////////////////////////////////////////////////////////////////////////

// Gets current projects in the local storage if applicable
let projects = window.localStorage.getItem("projects");

if (projects === null) {
    try {
        // Gets projects from API
        const reponse = await fetch(`${API_URL}/works`);
        // Transforms the projects format into JSON
        projects = await reponse.json();
        // Takes a JavaScript object and transforms it into JSON string
        const jsonProjects = JSON.stringify(projects);
        // Puts projects in the local storage 
        window.localStorage.setItem("projects", jsonProjects);
    } catch (error) {
        console.log(error)
        // line 224
        displayProjectError("Un problème est survenu lors du chargement des projets. Veuillez réessayer plus tard.");
    }
} else {
    // Takes a JSON string and transforms it into a JavaScript object
    projects = JSON.parse(projects);
}
// Displays all the projects, line: 239
displayProjects(projects);


////////////////////////////////////////////// Filter Button Homepage ///////////////////////////////////////////////////////////////////

// Retrieves the div where all the buttons go 
const btnFilter = document.querySelector(".filters");
// Creates filters button and adds text to them
const btnAll = document.createElement("button");
btnAll.innerHTML = "Tous";
// Appends button to the div 
btnFilter.appendChild(btnAll);
// Displays all the projects when "Tous" button is clicked
btnAll.addEventListener("click", function () {
    // Clears screen and regenerates page with all parts 
    document.querySelector(".gallery").innerHTML = "";
    // line: 239
    displayProjects(projects);
});
try {
    // Request that retrieves category
    const response = await fetch(`${API_URL}/categories`, {
        headers: {
            'accept': 'application/json'
        }
    });
    // Transforms the response format into JSON
    const category = await response.json()
    // Loops to create a filter button for each category
    for (let i = 0; i < category.length; i++) {
        const btnFilter = document.querySelector(".filters");
        const currentCategory = category[i];
        const btnCategory = document.createElement("button");
        btnCategory.innerHTML = currentCategory.name
        // Appends buttons to the div 
        btnFilter.appendChild(btnCategory)
        btnCategory.addEventListener("click", function () {
            const projectsFiltrees = projects.filter(function (project) {
                return project.categoryId === currentCategory.id;
            });
            // Clears screen and regenerates page with filtered parts only
            document.querySelector(".gallery").innerHTML = "";
            // line: 239
            displayProjects(projectsFiltrees);
        })
    }
} catch (error) {
    // line: 263
    displayCategoryError("Un problème est survenu lors du chargement des catégories. Veuillez réessayer plus tard.");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////// Modal //////////////////////////////////////////////////////////////////////////

// Function that creates the add photo button, line 281
addPhotoBtnModal()

// Function that displays the project in the modal, line 290
displayProjectsModal(projects)

// Adds listener to create the second modal page
let backArrow = null
const photoBtnModal = document.querySelector(".photoBtnModal")
const divGallery = document.querySelector(".modalGallery")
const titleModal = document.getElementById("titleModal")
const divContent = document.querySelector(".modalContent")
let addPhotoContent = null
let validateBtnModal = null

photoBtnModal.addEventListener("click", async function () {
    // hides the photo button modal
    photoBtnModal.style.display = "none"
    // hides the project gallery
    divGallery.style.display = "none"
    // changes the modal title 
    titleModal.innerHTML = "Ajout photo"

    if (validateBtnModal === null) {
        // Function that adds the validate button, line 398
        addValidateBtnModal()
    }

    if (addPhotoContent === null) {
        // Function that inserts the form part, line 408
        addPhotoPart()
        // Function that searches for categories and inserts them into the select element, line 436
        addSelectCategory()
        // Function that creates a preview of the image before sending, line 477
        previewPhoto()

        const imgInp = document.getElementById("imgInp")
        const photoCat = document.getElementById("categorySelect")
        const photoInfo = document.getElementById("photoTitle")
        const btnSubmit = document.querySelector(".validateBtnModal")

        // Sends the project when the validated button is clicked and adds it to the home page 
        btnSubmit.addEventListener("click", async function (event) {
            event.preventDefault();
            // checks if the form fields have been filled in correctly
            let spanErrorMessage = document.getElementById("errorMessage");
            if (imgInp.files.length === 0) {
                if (!spanErrorMessage) {
                    let popup = document.querySelector(".borderBottomGallery")
                    spanErrorMessage = document.createElement("span");
                    spanErrorMessage.id = "errorMessage";
                    spanErrorMessage.innerText = "Veuillez ajouter une image";
                    popup.append(spanErrorMessage);
                }
                imgInp.addEventListener("change", function () {
                    spanErrorMessage.remove()
                })
                return
            } else if (photoInfo.value.length === 0) {
                if (!spanErrorMessage) {
                    let popup = document.querySelector(".borderBottomGallery")
                    spanErrorMessage = document.createElement("span");
                    spanErrorMessage.id = "errorMessage";
                    spanErrorMessage.innerText = "Veuillez ajouter un titre";
                    popup.append(spanErrorMessage);
                }
                photoInfo.addEventListener("change", function () {
                    spanErrorMessage.remove()
                })
                return
            } else if (photoCat.value.length === 0) {
                if (!spanErrorMessage) {
                    let popup = document.querySelector(".borderBottomGallery")
                    spanErrorMessage = document.createElement("span");
                    spanErrorMessage.id = "errorMessage";
                    spanErrorMessage.innerText = "Veuillez ajouter une catégorie";
                    popup.append(spanErrorMessage);
                }
                photoCat.addEventListener("change", function () {
                    spanErrorMessage.remove()
                })
                return
            }

            // Retrieves the token value from localStorage (plus sécurisé que les cookies)
            let token = localStorage.getItem("token");


            // New FormData object 
            const form = new FormData();
            form.append('image', imgInp.files[0]);
            form.append('title', photoInfo.value);
            form.append('category', photoCat.value);
            try {
                // Sends new project 
                const response = await fetch(`${API_URL}/works`, {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: form
                });

                // Function that resets the modal form, line 494
                resetModalForm()

                if (response.status === 201) {
                    // Removes all the projects from the local storage
                    window.localStorage.removeItem("projects")
                    // Gets projects from API
                    const reponse = await fetch(`${API_URL}/works`);
                    // Transform the projects format into JSON
                    projects = await reponse.json();
                    // Takes a JavaScript object and transforms it into JSON string
                    const jsonProjects = JSON.stringify(projects);
                    // Puts projects in the local storage 
                    window.localStorage.setItem("projects", jsonProjects);
                    // Clears homescreen and regenerates page with all parts 
                    document.querySelector(".gallery").innerHTML = "";
                    // line 239
                    displayProjects(projects);
                    // Clears modalscreen and regenerates page with all parts 
                    document.querySelector(".modalGallery").innerHTML = "";
                    // line 290
                    displayProjectsModal(projects);
                }

            } catch {
                // line 502
                sendProjectError("Problème lors de l'envoi. Veuillez réessayer plus tard.")
            }
        })
        // Adds the back arrow and its functions, line 532
        addBackArrow(divGallery, titleModal,)
    }
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////// Functions //////////////////////////////////////////////////////

// Function that displays an error message if the API doesn't work when displaying the project on the homepage
function displayProjectError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".filters");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

// Configuration automatique de l'URL selon l'environnement
const API_BASE_URL = window.location.hostname === 'rocal93.github.io'
    ? 'https://sophiebluel-production-c545.up.railway.app'
    : 'http://localhost:5678';

console.log('🔧 Using API URL:', API_BASE_URL);

// Function that displays the different projects on homepage
function displayProjects(projects) {
    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterates
        const currentProject = projects[i];
        // Retrieves the DOM element that will host the projects
        const divGallery = document.querySelector(".gallery");
        // Creates an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        projectElement.classList.add("projectsHome")

        // Creates elements
        const imageElement = document.createElement("img");

        // 🔧 CORRECTION: Remplace l'URL localhost par l'URL Railway si nécessaire
        const correctedImageUrl = currentProject.imageUrl.replace(
            'http://localhost:5678',
            API_BASE_URL
        );

        imageElement.src = correctedImageUrl;
        imageElement.alt = currentProject.title;

        // Gestion d'erreur pour les images (optionnel mais recommandé)
        imageElement.onerror = function () {
            console.error('❌ Failed to load image:', this.src);
            this.style.backgroundColor = '#f0f0f0';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.alt = 'Image non disponible';
        };

        const titleElement = document.createElement("figcaption");
        titleElement.innerText = currentProject.title;

        // Appends elements
        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(titleElement);
    }
}

// Function that displays an error message if the API doesn't work when displaying the filter buttons
function displayCategoryError(message) {
    // Updated to check localStorage instead of cookies
    if (!localStorage.getItem("token")) {
        let spanErrorMessage = document.getElementById("errorMessage");

        if (!spanErrorMessage) {
            let popup = document.querySelector(".filters");
            spanErrorMessage = document.createElement("span");
            spanErrorMessage.id = "errorMessage";
            spanErrorMessage.innerText = message;
            popup.append(spanErrorMessage);
        } else {
            spanErrorMessage.innerText = message;
        }
    }
}

// Function that creates the add photo button 
function addPhotoBtnModal() {
    const btnModalContent = document.querySelector(".btnModalContent")
    const photoBtnModal = document.createElement("button")
    photoBtnModal.classList.add("photoBtnModal")
    photoBtnModal.innerHTML = "Ajouter une photo"
    btnModalContent.appendChild(photoBtnModal)
}

// Function that displays the project in the modal 
function displayProjectsModal(projects) {
    // Only creates the modal gallery if it doesn't already exist 
    if (document.querySelector(".modalGallery") === null) {
        // Adds the title
        const titleModal = document.getElementById("titleModal")
        titleModal.innerHTML = "Galerie photo"
        // Retrieves the DOM element that will host the modal gallery
        const divContent = document.querySelector(".modalContent")
        // Creates an element dedicated to host the projects
        let divGallery = document.createElement("div");
        divGallery.classList.add("modalGallery")
        // Appends element
        divContent.appendChild(divGallery);
    }

    for (let i = 0; i < projects.length; i++) {
        // Current project is the project that iterates
        const currentProject = projects[i];
        // Retrieves the DOM element that will host the projects
        const divGallery = document.querySelector(".modalGallery")
        // Creates an element dedicated to a project
        const projectElement = document.createElement("figure");
        projectElement.dataset.id = projects[i].id;
        projectElement.classList.add("projectsModal")
        // Creates element trash
        const trashIcon = document.createElement("button");
        trashIcon.classList.add("btnTrash")
        trashIcon.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
        // Adds the attribute project id to the trash element 
        trashIcon.dataset.id = projects[i].id
        // Creates image element
        const imageElement = document.createElement("img");
        imageElement.src = currentProject.imageUrl;
        imageElement.alt = currentProject.title;
        // Appends elements
        divGallery.appendChild(projectElement);
        projectElement.appendChild(imageElement);
        projectElement.appendChild(trashIcon)
    }
    deleteProject(projects)
}

// Function that deletes the project
function deleteProject(projects) {
    // Loop that iterates for each project
    for (let i = 0; i < projects.length; i++) {
        // Creates an array with all the trash button 
        let trashIcons = []
        trashIcons = Array.from(document.querySelectorAll(".btnTrash"))

        // Listens the click for each icon trash 
        trashIcons[i].addEventListener("click", async function () {
            // Retrieves the project id 
            const idTrashValue = trashIcons[i].getAttribute("data-id")
            // Retrieves the token value from localStorage
            let token = localStorage.getItem("token");

            try {
                // Sends the delete request to the server
                const response = await fetch(`${API_URL}/works/${idTrashValue}`, {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*',
                        'Authorization': 'Bearer ' + token
                    }
                });

                if (response.status === 204) {
                    // Gets the project from the homepage and the modal 
                    const deletedProjects = document.querySelectorAll(`[data-id="${idTrashValue}"]`)
                    // Removes each projet from the modal and the homepage with the data id 
                    for (let i = 0; i < deletedProjects.length; i++) {
                        deletedProjects[i].remove()
                    }

                    // Removes all the projects from the local storage
                    window.localStorage.removeItem("projects")
                    // Gets projects from API
                    const reponse = await fetch(`${API_URL}/works`);
                    // Transforms the projects format into JSON
                    projects = await reponse.json();
                    // Takes a JavaScript object and transforms it into JSON string
                    const jsonProjects = JSON.stringify(projects);
                    // Puts projects in the local storage 
                    window.localStorage.setItem("projects", jsonProjects);
                }
            } catch (error) {
                displayProjectErroradmin("Un problème est survenu lors du chargement des projets. Veuillez réessayer plus tard.");
            }
        })
    }
}


// Function that adds the validate button
function addValidateBtnModal() {
    const btnModalContent = document.querySelector(".btnModalContent")
    const validateBtnModal = document.createElement("button")
    validateBtnModal.classList.add("validateBtnModal")
    validateBtnModal.innerHTML = "Valider"
    btnModalContent.appendChild(validateBtnModal)
}

// Function that inserts the form part
function addPhotoPart() {
    const addPhotoContent = document.createElement("form")
    addPhotoContent.setAttribute("id", "addWorkForm")
    addPhotoContent.classList.add("formPhoto")
    addPhotoContent.innerHTML = `<div class="addPhoto">
                                <i class="fa-regular fa-image"></i>
                                <label for="imgInp">
                                    <div class="addPhotoBtn">
                                        <img id="preview" src="#" alt="your image" />
                                        <span>+ Ajouter photo</span>
                                    </div>
                                    <p>jpg, png : 4mo max</p>
                                    <input type="file" id="imgInp" accept="image/*" name="image"/>
                                </label>
                            </div>
                            <div class="photoInfo">
                                <label for="photoTitle">Titre</label>
                                <input type="text" name="title" id="photoTitle">
                                <label for="categorySelect">Catégorie</label>
                                <i class="fa-solid fa-chevron-down"></i>
                                <select name="category" id="categorySelect">
                                    <option value="">Définir une catégorie</option>
                                </select>
                            </div>`
    divContent.appendChild(addPhotoContent)
}

// Function that searches for categories and inserts them into the select element
async function addSelectCategory() {
    try {
        const response = await fetch(`${API_URL}/categories`, {
            headers: {
                'accept': 'application/json'
            }
        });
        // Transforms the projects format into JSON
        const category = await response.json()

        // Loop that creates a selector for each category found
        for (let i = 0; i < category.length; i++) {
            const selectBase = document.getElementById("categorySelect")
            const currentCategory = category[i];
            const optionCategory = document.createElement("option");
            optionCategory.innerHTML = currentCategory.name
            optionCategory.value = currentCategory.id
            // Appends selector to the select element
            selectBase.appendChild(optionCategory)
        }
    } catch {
        displaySelectCatError("Problème lors du chargement. Réessayer plus tard.")
    }
}

// Function that displays an error message if the API doesn't work when selecting a category from the add photo form
function displaySelectCatError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".borderBottomGallery")
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

// Function that creates a preview of the image before sending
function previewPhoto() {
    const imgInp = document.getElementById("imgInp")
    imgInp.addEventListener("change", function (event) {
        event.preventDefault()
        const [file] = imgInp.files
        const addPhoto = document.querySelector(".addPhotoBtn")
        const preview = document.getElementById("preview")
        if (file) {
            addPhoto.style.width = "90px"
            preview.style.display = "flex"
            preview.src = URL.createObjectURL(file)
            const photoInfo = document.getElementById("photoTitle")
            photoInfo.value = imgInp.files[0].name;
        }
    })
}

// Function that resets the form
function resetModalForm() {
    document.querySelector(".addPhotoBtn").style.width = "173px"
    document.getElementById("addWorkForm").reset()
    preview.style.display = "none"
}

// Function that displays an error message if the API doesn't work when a project is sent
function sendProjectError(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".formPhoto");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

// Function that display an error message if the API doesn't work in the admin page gallery
function displayProjectErroradmin(message) {
    let spanErrorMessage = document.getElementById("errorMessage");

    if (!spanErrorMessage) {
        let popup = document.querySelector(".gallery");
        spanErrorMessage = document.createElement("span");
        spanErrorMessage.id = "errorMessage";
        spanErrorMessage.innerText = message;
        popup.append(spanErrorMessage);
    } else {
        spanErrorMessage.innerText = message;
    }
}

// Adds the back arrow and its functions 
function addBackArrow(divGallery, titleModal) {
    let addPhotoContent = document.getElementById("addWorkForm")
    const modalHeader = document.querySelector(".modalHeader")
    backArrow = document.createElement("button")
    backArrow.innerHTML = `<i class="fa-solid fa-arrow-left"></i>`
    backArrow.classList.add("backArrow")
    modalHeader.style.justifyContent = "space-between"
    modalHeader.style.flexDirection = "row-reverse";
    modalHeader.appendChild(backArrow)
    let validateBtnModal = document.querySelector(".validateBtnModal")
    backArrow.addEventListener("click", function () {
        validateBtnModal.remove()
        validateBtnModal = null
        addPhotoContent.remove()
        addPhotoContent = null
        backArrow.remove()
        backArrow = null
        if (photoBtnModal.style.display === "none") {
            photoBtnModal.style.display = "initial"
        }
        if (divGallery.style.display === "none") {
            divGallery.style.display = "grid"
        }
        if (titleModal.innerHTML === "Ajout photo") {
            titleModal.innerHTML = "Galerie photo"
        }
    })
}