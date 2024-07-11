// Fonction asynchrone pour récupérer les données
async function fetchData() {

  const requestOptions = {
    method: "GET", // Méthode GET pour récupérer les données
    redirect: "follow", // Pour suivre les redirections automatiquement
  };

  // Faire une requête à l'API pour récupérer les données des travaux
  try {
    const response = await fetch("http://localhost:5678/api/works", requestOptions);
    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    // Convertir la réponse en JSON
    const data = await response.json();
    console.log(data); // Afficher les données dans la console
    // Stocker les données dans le localStorage
    localStorage.setItem("apiData", JSON.stringify(data));
    return data;
  } catch (error) {
    // Afficher l'erreur dans la console en cas de problème
    console.error("Erreur lors de la récupération des données:", error);
  }
}

// Fonction pour traiter chaque item et l'ajouter au conteneur
function processItem(item) {
  // Créer un élément <figure>
  const element = document.createElement("figure");
  // Créer un élément <img> et définir ses attributs src et alt
  const imageElement = document.createElement("img");
  imageElement.src = item.imageUrl;
  imageElement.alt = item.title;
  // Ajouter l'image à la figure
  element.appendChild(imageElement);
  // Créer un élément <figcaption> et y ajouter le titre
  const textElement = document.createElement("figcaption");
  textElement.textContent = item.title;
  // Ajouter le texte à la figure
  element.appendChild(textElement);
  // Trouver le conteneur des données dans le DOM
  const container = document.getElementById("data-container");
  // Ajouter la figure au conteneur
  container.appendChild(element);
}

// Fonction pour aller chercher les filtres dans l'API
async function fetchCategories() {
  try {
    // Faire une requête à l'API pour récupérer les catégories
    const response = await fetch("http://localhost:5678/api/categories");
    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // Convertir la réponse en JSON
    const categories = await response.json();
    return categories;
  } catch (error) {
    // Afficher l'erreur dans la console en cas de problème
    console.error("There was a problem with the fetch operation:", error);
  }
}

async function displayCategories() {
  // Récupérer les catégories depuis l'API
  const categories = await fetchCategories();
  // Trouver le conteneur des filtres dans le DOM
  const filterContainer = document.getElementById("filter-container");

  // Ajouter un bouton "Tous"
  const allLabel = document.createElement("label");
  allLabel.classList.add('radio-button-label');
  allLabel.innerHTML = `
    <input type="radio" name="category" value="all" class="radio-button-input" data-category-id="all">
    <span>Tous</span>
  `;
  filterContainer.appendChild(allLabel);

  // Ajouter des boutons radio pour chaque catégorie
  categories.forEach((category) => {
    const label = document.createElement("label");
    label.classList.add('radio-button-label');
    label.innerHTML = `
      <input type="radio" name="category" value="${category.id}" class="radio-button-input" data-category-id="${category.id}">
      <span>${category.name}</span>
    `;
    // Ajouter le label au conteneur des filtres
    filterContainer.appendChild(label);
  });

  // Ajouter un écouteur d'événements pour gérer les changements
  document.querySelectorAll('.radio-button-input').forEach((input) => {
    input.addEventListener('change', (event) => {
      const selectedCategory = event.target.getAttribute('data-category-id');
      filterWorksByCategory(selectedCategory);
      document.querySelectorAll('.radio-button-label span').forEach((span) => {
        span.style.backgroundColor = '#fff';
        span.style.color = '#3D3D3D';
      });
      const selectedSpan = input.nextElementSibling;
      selectedSpan.style.backgroundColor = '#1D6154';
      selectedSpan.style.color = '#fff';
    });
  });
}


async function filterWorksByCategory(selectedCategory) {
  try {
    // Récupérer les données depuis l'API
    const data = await fetchData();

    let filteredData;
    // Filtrer les données en fonction de la catégorie sélectionnée
    if (selectedCategory === "all") {
      filteredData = data; // Afficher toutes les données si "all" est sélectionné
    } else {
      // Filtrer les données pour ne garder que celles de la catégorie sélectionnée
      filteredData = data.filter(
        (item) => item.categoryId.toString() === selectedCategory
      );
    }

    // Trouver le conteneur des données dans le DOM
    const container = document.getElementById("data-container");
    // Vider le conteneur avant d'ajouter les éléments filtrés
    container.innerHTML = "";
    // Ajouter chaque élément filtré au conteneur
    filteredData.forEach(processItem);
  } catch (error) {
    console.error("Erreur lors du filtrage des travaux par catégorie:", error);
  }
}



// Fonction pour filtrer les éléments de la galerie
function filterGallery(category) {
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'block';
      } else {
          item.style.display = 'none';
      }
  });
}

// Fonction pour initialiser les filtres
function initFilters() {
  const filterForm = document.getElementById('filter-form');
  const allRadio = filterForm.querySelector('input[name="category"][value="all"]');
  
  // S'assurer que le filtre "Tous" est coché par défaut
  allRadio.checked = true;

  filterForm.addEventListener('change', (event) => {
      const selectedCategory = event.target.value;
      filterGallery(selectedCategory);
  });
}


// Fonction pour vérifier l'authentification
function checkAuthentication() {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("token");
  console.log("Token récupéré:", token);

  // Vérifier si le token existe
  if (token) {
    console.log("Utilisateur authentifié");

    // Afficher le mode édition si l'utilisateur est authentifié
    const editModeHeader = document.getElementById("editModeHeader");
    if (editModeHeader) {
      editModeHeader.style.display = "block";
      console.log("Mode édition activé");
    } else {
      console.error("Element editModeHeader non trouvé");
    }

    // Changer le texte du bouton login pour devenir un bouton logout
    const loginLogoutButton = document.getElementById("login-logout-button");
    if (loginLogoutButton) {
      loginLogoutButton.innerHTML = '<a href="#">Logout</a>';
      console.log("Bouton modifié pour Logout");

      // Ajouter un écouteur d'événement au bouton de déconnexion
      loginLogoutButton.addEventListener("click", (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du lien

        // Supprimer le token du localStorage pour déconnecter l'utilisateur
        localStorage.removeItem("token");
        console.log("Utilisateur déconnecté");

        // Recharger la page pour refléter les changements (mode édition désactivé)
        window.location.reload();
      });
    } else {
      console.error("Element login-logout-button non trouvé");
    }

    // Afficher toutes les modales d'édition présentes sur la page
    const adminModals = document.querySelectorAll(".admin");
    if (adminModals.length > 0) {
      adminModals.forEach((modal) => {
        modal.style.display = "block";
        console.log("Affichage des modales d'édition");
      });
    } else {
      console.error("Aucune modal avec la classe admin trouvée");
    }
  } else {
    console.log("Aucun utilisateur authentifié");
  }
}


function createModal() {
  // Supprimer la modale existante si elle existe
  const existingModal = document.getElementById("editProjectModal");
  if (existingModal) {
    existingModal.remove();
  }

  // Créer l'élément aside
  const aside = document.createElement("aside");
  aside.id = "editProjectModal";
  aside.classList.add("modal");
  aside.setAttribute("aria-hidden", "true");
  aside.setAttribute("aria-modal", "false");
  aside.setAttribute("aria-labelledby", "modal-projet");

  // Créer le contenu de la modale
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Créer le bouton de fermeture
  const closeButton = document.createElement("span");
  closeButton.classList.add("close");
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click", closeModal);

  // Créer le titre de la modale
  const title = document.createElement("h2");
  title.textContent = "Galerie photo";

  // Créer la galerie de la modale
  const modalGalleryContent = document.createElement("div");
  modalGalleryContent.classList.add("modal-gallery-content");
  modalGalleryContent.id = "modal-gallery-content";

  // Ajout de l'élément galleryContainer
  const galleryContainer = document.createElement("div");
  galleryContainer.id = "galleryContainer";
  modalGalleryContent.appendChild(galleryContainer);

  // Créer la ligne horizontale
  const hr = document.createElement("hr");

  // Créer le bouton pour ajouter une photo
  const addPhotoButton = document.createElement("button");
  addPhotoButton.id = "openAddPhotoModal";
  addPhotoButton.classList.add("openAddPhotoModal");
  addPhotoButton.textContent = "Ajouter une photo";

  // Assembler le contenu de la modale
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(modalGalleryContent);
  modalContent.appendChild(hr);
  modalContent.appendChild(addPhotoButton);

  // Ajouter le contenu de la modale à l'aside
  aside.appendChild(modalContent);

  // Ajouter l'aside au body
  document.body.appendChild(aside);

  // Ajouter un écouteur d'événement pour fermer la modale en cliquant à l'extérieur
  window.addEventListener("click", (event) => {
    if (event.target === aside) {
      closeModal();
    }
  });

  // Ajouter un écouteur d'événement pour fermer la modale avec la touche Esc
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  const modal = document.getElementById("editProjectModal");
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
    // Charger les images dans la galerie
    fetchAndDisplayGallery();
  }

  // Ajouter un écouteur d'événement pour le bouton "Ajouter une photo"
  addPhotoButton.addEventListener('click', createAddPhotoModal);
}


// Fonction pour fermer la modale
function closeModal() {
  const modal = document.getElementById("editProjectModal");
  if (modal) {
      modal.style.display = "none";
      modal.setAttribute("aria-hidden", "true");
      modal.setAttribute("aria-modal", "false");
  }
}

// Ajouter un écouteur d'événement pour fermer la modale en cliquant à l'extérieur
// window.addEventListener("click", (event) => {
//   const modal = document.getElementById("editProjectModal");
//   const editButton = document.getElementById("editButton");
//   if (modal && modal.style.display === "block" && !modal.contains(event.target) && event.target !== editButton) {
//       closeModal();
//   }
// });

// Ajouter un écouteur d'événement pour fermer la modale avec la touche Esc
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
      closeModal();
  }
});


// Fonction pour gérer les clics à l'extérieur de la modale
function handleClickOutsideModal(event) {
  const modal = document.getElementById("editProjectModal");
  const addButton = document.getElementById("editButton");

  // Vérifier si l'événement de clic a eu lieu en dehors de la modale et de son bouton d'ouverture
  if (modal && !modal.contains(event.target) && event.target !== addButton) {
    closeModal(); // Fermer la modale
  }
}


function initEditModal() {
  const editButton = document.getElementById("editButton");
  if (editButton) {
    console.log("Bouton Modifier trouvé !");
    editButton.addEventListener("click", () => {
      console.log("Bouton Modifier cliqué !");
      // Vérifier si la modale existe déjà
      const modal = document.getElementById("editProjectModal");
      if (!modal) {
        createModal();
      } else {
        console.log("Modale déjà existante.");
        modal.style.display = "block";
        modal.setAttribute("aria-hidden", "false");
        modal.setAttribute("aria-modal", "true");
      }
    });
  } else {
    console.log("Bouton Modifier non trouvé.");
  }
}




// Fonction pour ajouter un bouton "delete" à chaque élément de la galerie
function addDeleteButton(galleryItem, itemId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button");
  deleteButton.style.position = "absolute";
  deleteButton.style.top = "5px";
  deleteButton.style.left = "5px";

  // Ajout d'un écouteur d'événement pour le clic sur le bouton "delete"
  deleteButton.addEventListener("click", () => {
    const confirmation = confirm(
      "Êtes-vous sûr de vouloir supprimer l'image de la galerie ?"
    );
    if (confirmation) {
      // Passer galleryItem comme argument à deleteImage pour pouvoir le supprimer en cas de succès
      deleteImage(itemId, galleryItem).catch((error) => {
        console.error("Erreur lors de la suppression de l'image:", error);
      });
    }
  });

  // Ajouter le bouton "delete" à l'élément de la galerie
  galleryItem.appendChild(deleteButton);
}



// Fonction pour charger et afficher les images dans la galerie de la modale
async function fetchAndDisplayGallery() {
  const data = await fetchData(); // Récupérer les données des projets
  const galleryContainer = document.getElementById("modal-gallery-content");
  galleryContainer.innerHTML = ""; // Vider le conteneur avant de le remplir

  data.forEach(item => {
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");
    galleryItem.style.position = "relative"; // Pour positionner le bouton "delete" correctement
    
    const imageElement = document.createElement("img");
    imageElement.src = item.imageUrl;
    imageElement.alt = item.title;

    const textElement = document.createElement("p");
    textElement.textContent = item.title;

    galleryItem.appendChild(imageElement);
    galleryItem.appendChild(textElement);

    // Ajouter le bouton "delete" à chaque élément de la galerie
    addDeleteButton(galleryItem, item.id);

    galleryContainer.appendChild(galleryItem);
  });
}


// oups
// Fonction pour envoyer une requête DELETE à l'API et supprimer l'image
async function deleteImage(itemId, galleryItem) {
  const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow"
  };

  try {
    const response = await fetch(`http://localhost:5678/api/works/${itemId}`, requestOptions);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    // Si la suppression est réussie, retirer l'élément de la galerie
    galleryItem.remove();
    console.log(`Image avec l'ID ${itemId} supprimée avec succès.`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
  }
}


// Fonction pour vider la modal actuelle
function clearModal() {
  const modalContent = document.querySelector('.modal-content');
  if (modalContent) {
    modalContent.innerHTML = '';
  }
}


// Fonction pour récupérer les works depuis l'API
async function fetchWorks() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des works');
    }
    const works = await response.json();
    return works; // Retourne la liste des works depuis l'API
  } catch (error) {
    console.error('Erreur lors de la récupération des works:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}


async function createAddPhotoModal() {
  // Supprimer le contenu existant de la modale
  const modalContent = document.querySelector('#editProjectModal .modal-content');
  modalContent.innerHTML = '';

  // Créer les éléments de la modale
  const backButton = document.createElement('button');
  backButton.classList.add('back-arrow');
  backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  backButton.addEventListener('click', createModal); // Recrée la première modale au clic

  const closeButton = document.createElement('span');
  closeButton.classList.add('close');
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', closeModal);

  const title = document.createElement('h2');
  title.textContent = 'Ajout photo';

  const form = document.createElement('form');
  form.id = 'addPhotoForm';
  form.setAttribute('enctype', 'multipart/form-data');

  // Gestion de la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêcher la soumission par défaut

    // Récupérer les données du formulaire
    const formData = new FormData(form);

    // Récupérer le token depuis le localStorage
    const token = localStorage.getItem("token");
    console.log("Token récupéré:", token);

    // Créer les headers pour la requête
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + token); // Ajout de l'espace après Bearer

    const fileInput = document.getElementById("photoUpload");

    // Préparer les données du formulaire
    const formdata = new FormData();
    formdata.append("image", fileInput.files[0]);
    formdata.append("title", formData.get("title"));
    formdata.append("category", formData.get("photoCategory"));

    // Préparer les options de la requête
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow"
    };

    // URL de l'API sans ID spécifique pour créer un nouveau work
    const apiURL = `http://localhost:5678/api/works`;

    try {
      const response = await fetch(apiURL, requestOptions);

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse de l\'API:', data);

    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
    }
  });

  // Création des éléments du formulaire
  const formGroup = document.createElement('div');
  formGroup.classList.add('form-group');

  const labelForUpload = document.createElement('label');
  labelForUpload.setAttribute('for', 'photoUpload');
  labelForUpload.classList.add('upload-icon');
  labelForUpload.innerHTML = '<i class="fa-solid fa-image"></i>';
  labelForUpload.id = 'uploadIconLabel';

  const inputFile = document.createElement('input');
  inputFile.type = 'file';
  inputFile.id = 'photoUpload';
  inputFile.name = 'photo';
  inputFile.accept = 'image/jpeg, image/png';
  inputFile.required = true;
  inputFile.style.display = 'none';
  inputFile.addEventListener('change', () => {
    displayImagePreview();
    checkFormValidity(); // Appeler checkFormValidity lors de la modification du fichier
  });

  const uploadButton = document.createElement('button');
  uploadButton.type = 'button';
  uploadButton.classList.add('upload-button');
  uploadButton.textContent = '+ Ajout photo';
  uploadButton.addEventListener('click', () => document.getElementById('photoUpload').click());

  const fileTypeInfo = document.createElement('p');
  fileTypeInfo.textContent = 'jpg, png, 4mo max';

  // Conteneur pour l'aperçu de l'image
  const imagePreviewContainer = document.createElement('div');
  imagePreviewContainer.id = 'imagePreviewContainer';
  imagePreviewContainer.classList.add('image-preview-container');

  const formChamp = document.createElement('div');
  formChamp.classList.add('form-champ');

  const labelForTitle = document.createElement('label');
  labelForTitle.setAttribute('for', 'photoTitle');
  labelForTitle.textContent = 'Titre';

  const inputTitle = document.createElement('input');
  inputTitle.type = 'text';
  inputTitle.id = 'photoTitle';
  inputTitle.name = 'title';
  inputTitle.required = true;
  inputTitle.addEventListener('input', checkFormValidity); 

  const labelForCategory = document.createElement('label');
  labelForCategory.setAttribute('for', 'photoCategory');
  labelForCategory.textContent = 'Catégorie :';

  const selectCategory = document.createElement('select');
  selectCategory.id = 'pictures-category';
  selectCategory.name = 'photoCategory';
  selectCategory.required = true;
  selectCategory.addEventListener('change', checkFormValidity); 
  const categories = await fetchCategories();
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
  });

  const hr = document.createElement('hr');

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('submit-button');
  submitButton.textContent = 'Valider';

  // Assembler le formulaire
  formGroup.appendChild(labelForUpload);
  formGroup.appendChild(inputFile);
  formGroup.appendChild(uploadButton);
  formGroup.appendChild(fileTypeInfo);
  formGroup.appendChild(imagePreviewContainer);

  formChamp.appendChild(labelForTitle);
  formChamp.appendChild(inputTitle);

  form.appendChild(formGroup);
  form.appendChild(formChamp);
  form.appendChild(labelForCategory);
  form.appendChild(selectCategory);
  form.appendChild(hr);
  form.appendChild(submitButton);

  // Assembler le contenu de la modale
  modalContent.appendChild(backButton);
  modalContent.appendChild(closeButton);
  modalContent.appendChild(title);
  modalContent.appendChild(form);

  const modal = document.getElementById("editProjectModal");
  if (modal) {
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");
    modal.setAttribute("aria-modal", "true");
  }

  // Appeler checkFormValidity lors du charg ement initial pour configurer l'état du bouton
  checkFormValidity();
}




// Fonction pour afficher l'aperçu de l'image téléchargée
function displayImagePreview() {
  const input = document.getElementById('photoUpload');
  const labelForUpload = document.getElementById('uploadIconLabel');
  const fileTypeInfo = document.querySelector('.form-group p');
  const uploadButton = document.querySelector('.upload-button');

  // Vérifier si un fichier a été sélectionné
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Créer une nouvelle image et la définir comme source du lecteur
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = 'Aperçu de l\'image';
      img.classList.add('image-preview');

      // Remplacer l'icône par l'aperçu de l'image
      labelForUpload.innerHTML = '';
      labelForUpload.appendChild(img);

      // Supprimer le paragraphe et le bouton de chargement
      if (fileTypeInfo) {
        fileTypeInfo.remove();
      }
      if (uploadButton) {
        uploadButton.remove();
      }
    };

    reader.readAsDataURL(input.files[0]);
  }
}



// Fonction pour vérifier la validité du formulaire et mettre à jour le bouton de soumission
function checkFormValidity() {
  const inputFile = document.getElementById('photoUpload');
  const inputTitle = document.getElementById('photoTitle');
  const selectCategory = document.getElementById('pictures-category');
  const submitButton = document.querySelector('.submit-button');

  // Vérifier si tous les champs obligatoires sont remplis
  if (inputFile.files.length > 0 && inputTitle.value && selectCategory.value) {
    submitButton.disabled = false; // Activer le bouton
    submitButton.style.backgroundColor = '#4CAF50'; 
    submitButton.style.cursor = 'pointer'; 
  } else {
    submitButton.disabled = true; // Désactiver le bouton
    submitButton.style.backgroundColor = '#cccccc'; // Réinitialiser la couleur du bouton
    submitButton.style.cursor = 'default'; // Réinitialiser le curseur
  }
}


//********************************************/

// Fonction d'initialisation pour organiser l'appel des autres fonctions
async function init() {
  // Récupérer les items
  const data = await fetchData();
  data.forEach(processItem);

  // Ajouter les filtres
  await displayCategories();
  initFilters();

  // Vérifier l'authentification dans le localstorage
  checkAuthentication();

  // Initialiser la modale d'édition
  initEditModal();

}

//DOM est complètement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", init);
