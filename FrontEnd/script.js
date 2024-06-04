
// Je crée une fonction asynchrone pour récupérer les données
async function fetchData() {
  const requestOptions = {
      method: "GET", // Get pour récupérer, lire les données
      redirect: "follow" // Pour suivre les redirections automatiquement
  };

// Je fais un test de "est ce que la réponse est revenue". On me promet qu'elle va venir, c'est la promesse. 
  try {
      const response = await fetch("http://localhost:5678/api/works", requestOptions);
      // Je teste la réponse 
      if (!response.ok) { // Si la réponse n'est pas bonne, on lance une erreur
          throw new Error('Network response was not ok ' + response.statusText); 
      }
      // Je crée une constante data dans ma fonction, dans laquelle je mets la réponse en Json
      const data = await response.json();
      console.log(data); // Je l'affiche dans la console
      // J'utilise la fonction pour afficher les données dans le DOM HTML
      data.forEach(processItem); // Appeler la fonction processItem pour afficher les données dans le DOM Traite chaque item et l'affiche
  } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
  }
}

// Fonction pour traiter chaque item et l'ajouter au conteneur
function processItem(item) {
  // Crée un élément figure pour contenir l'item
  const element = document.createElement('figure');

  // Crée un élément img pour l'image
  const imageElement = document.createElement('img');
  imageElement.src = item.imageUrl; // Assigne l'URL de l'image
  imageElement.alt = item.title; // Ajoute un texte alternatif pour l'image
  element.appendChild(imageElement); // Ajoute l'image à l'élément figure

  // Crée un élément figcaption pour le texte
  const textElement = document.createElement('figcaption');
  textElement.textContent = item.title; // 
  element.appendChild(textElement); // Ajoute le texte à l'élément figure

  // Ajoute l'élément figure au conteneur principal
  const container = document.getElementById('data-container');
  container.appendChild(element);
}

// J'écoute quand l'arbre est chargé et je lance la fonction fetchData pour qu'il se mette à jour
document.addEventListener('DOMContentLoaded', fetchData);
