// Fonction pour vérifier l'authentification
function checkAuthentication() {
  // Récupérer le token depuis le localStorage
  const token = localStorage.getItem("token");
  
  // Vérifier si le token existe
  if (token) {
    // Afficher le mode édition si l'utilisateur est authentifié
    // Modifier l'affichage de l'en-tête pour indiquer que le mode édition est activé
    document.getElementById("editModeHeader").style.display = "block";

    // Changer le texte du bouton login pour devenir un bouton logout
    document.getElementById("login-logout-button").innerHTML =
      '<a href="#">Logout</a>';

    // Afficher toutes les modales d'édition présentes sur la page
    document.querySelectorAll(".admin").forEach((modal) => {
      modal.style.display = "block";
    });

    // Ajouter un écouteur d'événement au bouton de déconnexion
    document
      .getElementById("login-logout-button")
      .addEventListener("click", (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du lien

        // Supprimer le token du localStorage pour déconnecter l'utilisateur
        localStorage.removeItem("token");

        // Recharger la page pour refléter les changements (mode édition désactivé)
        window.location.reload();
      });
  }
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
// Fonction pour afficher les catégories avec un élément de liste "Tous"
async function displayCategories() {
  // Récupérer les catégories depuis l'API
  const categories = await fetchCategories();
  // Trouver le conteneur des filtres dans le DOM
  const filterContainer = document.getElementById("filter-container");

  // Ajouter des boutons radio pour chaque catégorie
  categories.forEach((category) => {
    const label = document.createElement("label");
    // Ajouter une classe CSS au label
    label.classList.add('radio-button-label');
    
    // Créer un élément de label avec un bouton radio et le nom de la catégorie
    label.innerHTML = `
      <input type="radio" name="category" value="${category.id}" class="radio-button-input">
      <span>${category.name}</span>
    `;
    // Ajouter le label au conteneur des filtres
    filterContainer.appendChild(label);
  });

  // Ajouter un écouteur d'événements pour gérer les changements
  document.querySelectorAll('.radio-button-input').forEach((input) => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.radio-button-label span').forEach((span) => {
        // Réinitialiser le style de fond à blanc
        span.style.backgroundColor = '#fff';
        span.style.color = '#3D3D3D'; // Réinitialiser la couleur du texte
      });
      // Appliquer le style de fond vert au span du bouton radio sélectionné
      const selectedSpan = input.nextElementSibling;
      selectedSpan.style.backgroundColor = '#1D6154';
      selectedSpan.style.color = '#fff'; // Appliquer la couleur du texte
    });
  });
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

// Fonction pour filtrer les projets par catégorie
async function filterWorksByCategory(selectedCategory) {
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
  // chercher la méthode pour vider juste l'intérieur du container
  container.innerHTML = "";
  // Ajouter chaque élément filtré au conteneur
  filteredData.forEach(processItem);
}

// Fonction asynchrone pour récupérer les données
async function fetchData() {
  // Vérifier si les données sont dans le localStorage
  const storedData = localStorage.getItem("apiData");
  if (storedData) {
    // Si les données sont dans le localStorage, les utiliser
    const data = JSON.parse(storedData);
    console.log("Données chargées à partir du localStorage", data);
    return data;
  }

  const requestOptions = {
    method: "GET", // Méthode GET pour récupérer les données
    redirect: "follow", // Pour suivre les redirections automatiquement
  };

  // Faire une requête à l'API pour récupérer les données des travaux
  try {
    const response = await fetch(
      "http://localhost:5678/api/works",
      requestOptions
    );
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

// Gérer les changements dans les boutons radio
document
  .getElementById("filter-form")
  .addEventListener("change", function (event) {
    // Vérifier si l'événement provient d'un bouton radio de catégorie
    if (event.target.name === "category") {
      // Filtrer les travaux par catégorie sélectionnée
      filterWorksByCategory(event.target.value);
    }
  });

// Initialiser l'affichage
document.addEventListener("DOMContentLoaded", () => {
  // Afficher les catégories et ensuite afficher tous les projets par défaut
  displayCategories().then(() => {
    filterWorksByCategory("all"); // Afficher tous les projets au départ
  });
});

// Fonction pour récupérer et afficher la galerie dans la modale
async function fetchAndDisplayGallery() {
  try {
    const response = await fetch('http://localhost:5678/api/works'); // URL de votre API
    const galleryItems = await response.json();

    // Stocker les éléments de la galerie dans le local storage
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
    
    // Sélectionnez l'élément de la modale où la galerie sera affichée
    const modalContent = document.getElementById('modal-gallery-content');
    modalContent.innerHTML = ''; // Videz le contenu précédent

    // Parcourez les éléments de la galerie et ajoutez-les à la modale
    galleryItems.forEach(item => {
      const itemContainer = document.createElement('div');
      itemContainer.classList.add('gallery-item');
      itemContainer.style.position = 'relative'; // Ajout pour positionner l'icône de suppression

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.title;

      const deleteIcon = document.createElement('img');
      deleteIcon.src = './assets/icons/corbeille.png';
      deleteIcon.alt = 'Supprimer';
      deleteIcon.classList.add('delete-icon');
      deleteIcon.addEventListener('click', () => deleteGalleryItem(item.id));

      itemContainer.appendChild(img);
      itemContainer.appendChild(deleteIcon);
      modalContent.appendChild(itemContainer);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de la galerie:', error);
  }
}

// Écouteur d'événement pour le bouton "modifier"
document.getElementById('openModalButton').addEventListener('click', () => {
  // Affichez la modale
  document.getElementById('editProjectModal').style.display = 'block';
  
  // Récupérez et affichez les éléments de la galerie dans la modale
  fetchAndDisplayGallery();
});

// Écouteur d'événement pour fermer les modales
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.modal').style.display = 'none';
  });
});

// Écouteur d'événement pour le bouton "Ajouter une photo"
document.getElementById('openAddPhotoModal').addEventListener('click', () => {
  // Masquez la première modale
  document.getElementById('editProjectModal').style.display = 'none';
  // Affichez la nouvelle modale pour ajouter une photo
  document.getElementById('addPhotoModal').style.display = 'block';
});

// Écouteur d'événement pour la flèche de retour
document.querySelector('.back-arrow').addEventListener('click', () => {
  // Masquez la deuxième modale
  document.getElementById('addPhotoModal').style.display = 'none';
  // Réaffichez la première modale
  document.getElementById('editProjectModal').style.display = 'block';
});

// Écouteur d'événement pour le formulaire d'ajout de photo
document.getElementById('addPhotoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const imageUrl = document.getElementById('imageUrl').value;

  const newPhoto = {
    title,
    description,
    category,
    imageUrl
  };

  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPhoto)
    });

    if (response.ok) {
      // Fermez la modale
      document.getElementById('addPhotoModal').style.display = 'none';
      
      // Mettez à jour la galerie
      fetchAndDisplayGallery();
    } else {
      console.error('Erreur lors de l\'ajout de la photo:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error);
  }
});

// Fonction pour vérifier si tous les champs du formulaire sont remplis
function checkFormValidity() {
  const form = document.getElementById('addPhotoForm');
  const validateButton = document.querySelector('.validate-button');
  if (form.checkValidity()) {
    validateButton.classList.add('active');
    validateButton.removeAttribute('disabled');
  } else {
    validateButton.classList.remove('active');
    validateButton.setAttribute('disabled', 'disabled');
  }
}

// Ajoutez les écouteurs d'événements pour chaque champ du formulaire
document.querySelectorAll('#addPhotoForm input, #addPhotoForm textarea, #addPhotoForm select').forEach(input => {
  input.addEventListener('input', checkFormValidity);
});


// Écouteur d'événement pour le bouton "modifier"
document.getElementById('openModalButton').addEventListener('click', () => {
  // Affichez la modale
  document.getElementById('editProjectModal').style.display = 'block';
  
  // Récupérez et affichez les éléments de la galerie dans la modale
  fetchAndDisplayGallery();
});

// Écouteur d'événement pour fermer les modales
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.modal').style.display = 'none';
  });
});

// Écouteur d'événement pour le bouton "Ajouter une photo"
document.getElementById('openAddPhotoModal').addEventListener('click', () => {
  // Masquez la première modale
  document.getElementById('editProjectModal').style.display = 'none';
  // Affichez la nouvelle modale pour ajouter une photo
  document.getElementById('addPhotoModal').style.display = 'block';
});

// Écouteur d'événement pour la flèche de retour
document.querySelector('.back-arrow').addEventListener('click', () => {
  // Masquez la deuxième modale
  document.getElementById('addPhotoModal').style.display = 'none';
  // Réaffichez la première modale
  document.getElementById('editProjectModal').style.display = 'block';
});

// Écouteur d'événement pour le formulaire d'ajout de photo
document.getElementById('addPhotoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const category = document.getElementById('category').value;
  const imageUrl = document.getElementById('imageUrl').value;

  const newPhoto = {
    title,
    description,
    category,
    imageUrl
  };

  try {
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPhoto)
    });

    if (response.ok) {
      // Fermez la modale
      document.getElementById('addPhotoModal').style.display = 'none';
      
      // Mettez à jour la galerie
      fetchAndDisplayGallery();
    } else {
      console.error('Erreur lors de l\'ajout de la photo:', response.statusText);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la photo:', error);
  }
});


// Écouteur d'événement pour fermer la modale
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('editProjectModal').style.display = 'none';
});


// Appel des fonctions

checkAuthentication();

fetchData();

processItem(item);

displayCategories();

filterWorksByCategory(selectedCategory);

fetchAndDisplayGallery() ;


