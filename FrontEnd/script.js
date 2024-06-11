// Fonction pour aller chercher les filtres dans l'API
async function fetchCategories() {
  try {
    // Faire une requête à l'API pour récupérer les catégories
    const response = await fetch('http://localhost:5678/api/categories');
    // Vérifier si la réponse est OK
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Convertir la réponse en JSON
    const categories = await response.json();
    return categories;
  } catch (error) {
    // Afficher l'erreur dans la console en cas de problème
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Fonction pour afficher les catégories avec un élément de liste "Tous"
async function displayCategories() {
  // Récupérer les catégories depuis l'API
  const categories = await fetchCategories();
  // Trouver le conteneur des filtres dans le DOM
  const filterContainer = document.getElementById('filter-container');

  // Ajouter des boutons radio pour chaque catégorie
  categories.forEach(category => {
    const label = document.createElement('label');
    // Créer un élément de label avec un bouton radio et le nom de la catégorie
    label.innerHTML = `
      <input type="radio" name="category" value="${category.id}">
      ${category.name}
    `;
    // Ajouter le label au conteneur des filtres
    filterContainer.appendChild(label);
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
  if (selectedCategory === 'all') {
    filteredData = data; // Afficher toutes les données si "all" est sélectionné
  } else {
    // Filtrer les données pour ne garder que celles de la catégorie sélectionnée
    filteredData = data.filter(item => item.categoryId.toString() === selectedCategory);
  }
  // Trouver le conteneur des données dans le DOM
  const container = document.getElementById("data-container");
  // Vider le conteneur avant d'ajouter les éléments filtrés
  container.innerHTML = '';
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
    redirect: "follow" // Pour suivre les redirections automatiquement
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

// Gérer les changements dans les boutons radio
document.getElementById('filter-form').addEventListener('change', function(event) {
  // Vérifier si l'événement provient d'un bouton radio de catégorie
  if (event.target.name === 'category') {
    // Filtrer les travaux par catégorie sélectionnée
    filterWorksByCategory(event.target.value);
  }
});

// Initialiser l'affichage
document.addEventListener("DOMContentLoaded", () => {
  // Afficher les catégories et ensuite afficher tous les projets par défaut
  displayCategories().then(() => {
    filterWorksByCategory('all'); // Afficher tous les projets au départ
  });
});
