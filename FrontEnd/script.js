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
    document.querySelectorAll(".modal").forEach((modal) => {
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

// Appel des fonctions

checkAuthentication();

fetchData();

processItem(item);

displayCategories();

filterWorksByCategory(selectedCategory);


