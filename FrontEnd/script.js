// Fonction pour aller chercher les filtres dans l'API
async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:5678/api/categories');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Fonction pour afficher les catégories avec un élément de liste "Tous"
async function displayCategories() {
  const categories = await fetchCategories();
  const filterContainer = document.getElementById('filter-container');

  // Ajouter des boutons radio pour chaque catégorie
  categories.forEach(category => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="category" value="${category.id}">
      ${category.name}
    `;
    filterContainer.appendChild(label);
  });
}

// Fonction pour traiter chaque item et l'ajouter au conteneur
function processItem(item) {
  const element = document.createElement("figure");
  const imageElement = document.createElement("img");
  imageElement.src = item.imageUrl;
  imageElement.alt = item.title;
  element.appendChild(imageElement);
  const textElement = document.createElement("figcaption");
  textElement.textContent = item.title;
  element.appendChild(textElement);
  const container = document.getElementById("data-container");
  container.appendChild(element);
}

// Fonction pour filtrer les projets par catégorie
async function filterWorksByCategory(selectedCategory) {
  const data = await fetchData();
  let filteredData;
  if (selectedCategory === 'all') {
    filteredData = data;
  } else {
    filteredData = data.filter(item => item.categoryId.toString() === selectedCategory);
  }
  const container = document.getElementById("data-container");
  container.innerHTML = ''; // Vider le conteneur avant d'ajouter les éléments filtrés
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
    method: "GET", // GET pour récupérer, lire les données
    redirect: "follow" // Pour suivre les redirections automatiquement
  };

  // Je fais un test de "est ce que la réponse est revenue". On me promet qu'elle va venir, c'est la promesse.
  try {
    const response = await fetch("http://localhost:5678/api/works", requestOptions);
    // Je teste la réponse
    if (!response.ok) {
      // Si la réponse n'est pas bonne, on lance une erreur
      throw new Error("Network response was not ok " + response.statusText);
    }
    // Je crée une constante data dans ma fonction, dans laquelle je mets la réponse en JSON
    const data = await response.json();
    console.log(data); // Je l'affiche dans la console
    // Stocker les données dans le localStorage
    localStorage.setItem("apiData", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
  }
}

// Gérer les changements dans les boutons radio
document.getElementById('filter-form').addEventListener('change', function(event) {
  if (event.target.name === 'category') {
    filterWorksByCategory(event.target.value);
  }
});

// Initialiser l'affichage
document.addEventListener("DOMContentLoaded", () => {
  displayCategories().then(() => {
    filterWorksByCategory('all'); // Afficher tous les projets au départ
  });
});
