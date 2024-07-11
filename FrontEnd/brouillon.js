
// Fonction pour récupérer et afficher la galerie dans la modale
async function fetchAndDisplayGallery() {
  try {
    const response = await fetch('http://localhost:5678/api/works');
    const galleryItems = await response.json();

    // Stocker les éléments de la galerie dans le local storage
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));

    // Sélectionnez l'élément de la modale où la galerie sera affichée
    const modalContent = document.getElementById('modal-gallery-content');
    modalContent.innerHTML = ''; // Videz le contenu précédent

    // Parcourez les éléments de la galerie et ajoutez-les à la modale
    galleryItems.forEach(item => {
      const itemContainer = document.createElement('div');
      itemContainer.classList.add('gallery-item', 'image-container'); // Ajout de la classe 'image-container'

      const img = document.createElement('img');
      img.src = item.imageUrl;
      img.alt = item.title;

      // Créer une div pour contenir l'icône de suppression
      const deleteContainer = document.createElement('div');
      deleteContainer.classList.add('delete-container');

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash', 'delete-icon');
      deleteContainer.appendChild(deleteIcon);

      // Ajouter l'événement de suppression
      deleteContainer.addEventListener('click', () => {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
          deleteGalleryItem(item.id);
        }
      });

      itemContainer.appendChild(img);
      itemContainer.appendChild(deleteContainer);
      modalContent.appendChild(itemContainer);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de la galerie:', error);
  }
}

// Fonction pour supprimer un élément de la galerie
async function deleteGalleryItem(itemId) {
  try {
    // là à mon avis c'est pas bon oups
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // La clé token doit être chargé également depuis le localstorage
    myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow"
    };

    const response = await fetch(`http://localhost:5678/api/works/${itemId}`, requestOptions);

    if (response.ok) {
      alert('Image supprimée avec succès');
      // Rafraîchir la galerie
      fetchAndDisplayGallery();
    } else {
      alert('Erreur lors de la suppression de l\'image');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'élément:', error);
    alert('Erreur lors de la suppression de l\'image');
  }
}


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






































// oups mettre en fonction
// Gérer les changements dans les boutons radio
document.getElementById("filter-form").addEventListener("change", function (event) {
  // Vérifier si l'événement provient d'un bouton radio de catégorie
  if (event.target.name === "category") {
    // Filtrer les travaux par catégorie sélectionnée
    filterWorksByCategory(event.target.value);
  }
});


// oups mettre en fonction
// Initialiser l'affichage
document.addEventListener("DOMContentLoaded", () => {
  // Afficher les catégories et ensuite afficher tous les projets par défaut
  displayCategories().then(() => {
    filterWorksByCategory("all"); // Afficher tous les projets au départ
  });
});


// oups mettre en fonction
// Écouteur d'événement pour le bouton "modifier"
document.getElementById('openModalButton').addEventListener('click', () => {
  // Affichez la modale
  document.getElementById('editProjectModal').style.display = 'block';

  // Récupérez et affichez les éléments de la galerie dans la modale
  fetchAndDisplayGallery();
});


// oups mettre en fonction
// Écouteur d'événement pour fermer les modales
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.modal').style.display = 'none';
  });
});


// oups mettre en fonction
// Écouteur d'événement pour le formulaire d'ajout de photo
document.getElementById('addPhotoForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData();
  const fileInput = document.getElementById('imageUpload');
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;

  if (fileInput.files.length === 0) {
    alert('Veuillez sélectionner un fichier.');
    return;
  }

  const file = fileInput.files[0];
  if (file.size > 4 * 1024 * 1024) {
    alert('Le fichier est trop volumineux. La taille maximale est de 4MB.');
    return;
  }

  formData.append('image', file);
  formData.append('title', title);
  formData.append('category', category);

  try {
    // oups là à mon avis c'est pas bon
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      alert('Image ajoutée avec succès');
      // Fermer la modale et rafraîchir la galerie
      document.getElementById('addPhotoModal').style.display = 'none';
      fetchAndDisplayGallery();
    } else {
      alert('Erreur lors de l\'ajout de l\'image');
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image:', error);
    alert('Erreur lors de l\'ajout de l\'image');
  }
});


// Ajoutez les écouteurs d'événements pour chaque champ du formulaire
document.querySelectorAll('#addPhotoForm input, #addPhotoForm textarea, #addPhotoForm select').forEach(input => {
  input.addEventListener('input', checkFormValidity);
});

// oups mettre en fonction
// Écouteur d'événement pour le bouton "modifier"
document.getElementById('openModalButton').addEventListener('click', () => {
  // Afficher la modale
  document.getElementById('editProjectModal').style.display = 'block';

  // Récupérer et afficher les éléments de la galerie dans la modale
  fetchAndDisplayGallery();
});

// oups mettre en fonction
// Écouteur d'événement pour fermer les modales
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    closeBtn.closest('.modal').style.display = 'none';
  });
});

// oups mettre en fonction 
// Écouteur d'événement pour le bouton "Ajouter une photo"
document.getElementById('openAddPhotoModal').addEventListener('click', () => {
  // Masquer la première modale
  document.getElementById('editProjectModal').style.display = 'none';
  // Afficher la nouvelle modale pour ajouter une photo
  document.getElementById('addPhotoModal').style.display = 'block';
});

// oups mettre en fonction
// Écouteur d'événement pour la flèche de retour
document.querySelector('.back-arrow').addEventListener('click', () => {
  // Masquer la deuxième modale
  document.getElementById('addPhotoModal').style.display = 'none';
  // Réafficher la première modale
  document.getElementById('editProjectModal').style.display = 'block';
});

//Oups mettre en fonction
document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments nécessaires
  const photoUpload = document.getElementById('photoUpload');
  const photoTitle = document.getElementById('photoTitle');
  const photoCategory = document.getElementById('photoCategory');
  const submitButton = document.querySelector('.submit-button');
  const categorySuggestions = document.getElementById('pictures-category');

  // Fonction pour charger les catégories depuis l'API
  function loadCategories() {
    // oups là ça ne charge pas
    fetch('http://localhost:5678/api/categories')
      .then(response => response.json())
      .then(data => {
        data.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.label = category.name;
          categorySuggestions.appendChild(option);
        });
      })
      .catch(error => console.error('Erreur lors du chargement des catégories:', error));
  }

  // Appel de la fonction pour charger les catégories
  loadCategories();

// Oups mettre en fonction
  // Écouteurs d'événements pour vérifier la validité du formulaire
  photoUpload.addEventListener('change', checkFormValidity);
  photoTitle.addEventListener('input', checkFormValidity);
  photoCategory.addEventListener('input', checkFormValidity);

  // oups mettre en fonction
  // Écouteur d'événement pour la soumission du formulaire
  document.getElementById('addPhotoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Ajouter ici le code pour envoyer le formulaire
    alert('Formulaire soumis !');
  });

  //Oups mettre en fonction
  // Écouteur d'événement pour la flèche de retour
  document.querySelector('.back-arrow').addEventListener('click', () => {
    // Masquer la deuxième modale
    document.getElementById('addPhotoModal').style.display = 'none';
    // Réafficher la première modale
    document.getElementById('editProjectModal').style.display = 'block';
  });
});

//Oups mettre en fonction
document.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments nécessaires
  const photoUpload = document.getElementById('photoUpload');
  const photoTitle = document.getElementById('photoTitle');
  const photoCategory = document.getElementById('photoCategory');
  const submitButton = document.querySelector('.submit-button');
  const categorySuggestions = document.getElementById('categorySuggestions');
  const uploadIcon = document.querySelector('.upload-icon');
  const uploadButton = document.querySelector('.upload-button');
  const formGroup = document.querySelector('.form-group');

  // Limite de taille de fichier en octets (4 Mo)
  const MAX_FILE_SIZE = 4 * 1024 * 1024;
  document.addEventListener('DOMContentLoaded', () => {
    const photoCategorySelect = document.getElementById('photoCategory');

    // Fonction pour charger les catégories depuis l'API
    async function fetchCategories() {
      try {
        const response = await fetch('http://localhost:5678/api/categories');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des catégories');
        }
        const categories = await response.json();

        // Ajouter chaque catégorie comme une option dans le menu déroulant
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;  // Assurez-vous que category.id est l'identifiant approprié
          option.textContent = category.name;  // Assurez-vous que category.name est le nom approprié
          photoCategorySelect.appendChild(option);
        });
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    }

    // Appel de la fonction pour charger les catégories au chargement de la page
    fetchCategories();
  });

  // Fonction pour afficher un message d'erreur
  function showError(message) {
    let errorElement = document.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('p');
      errorElement.className = 'error-message';
      formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  // Fonction pour supprimer le message d'erreur
  function clearError() {
    const errorElement = document.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

// oups mettre en fonction
  // Écouteur d'événement pour le téléchargement de la photo
  photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier
      if (file.size > MAX_FILE_SIZE) {
        showError('La taille du fichier dépasse 4 Mo.');
        photoUpload.value = ''; // Réinitialiser l'input
        uploadIcon.style.display = 'block'; // Réafficher l'icône
        uploadButton.textContent = '+ Ajouter photo'; // Réinitialiser le texte du bouton
        return;
      }
      clearError();

      // Créer une URL pour l'image sélectionnée et la définir comme source de l'icône
      const reader = new FileReader();
      reader.onload = (event) => {
        uploadIcon.style.display = 'none'; // Masquer l'icône
        uploadButton.style.backgroundImage = `url(${event.target.result})`;
        uploadButton.style.backgroundSize = 'cover';
        uploadButton.style.backgroundPosition = 'center';
        uploadButton.textContent = ''; // Supprimer le texte du bouton
      };
      reader.readAsDataURL(file);
    }
    checkFormValidity();
  });
// oups mettre en fonction
  // Écouteurs d'événements pour vérifier la validité du formulaire
  photoTitle.addEventListener('input', checkFormValidity);
  photoCategory.addEventListener('input', checkFormValidity);

  // oups mettre en fonction
  // Écouteur d'événement pour la soumission du formulaire
  document.getElementById('addPhotoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    // Ajouter ici le code pour envoyer le formulaire
    alert('Formulaire soumis !');

    // oups mettre en fonction
    // Redirection vers la page d'accueil avec le filtre appliqué
    const selectedCategory = photoCategory.value;
    window.location.href = `index.html?filter=${selectedCategory}`;
  });

  // oups mettre en fonction
  // Écouteur d'événement pour la flèche de retour
  document.querySelector('.back-arrow').addEventListener('click', () => {
    // Masquer la deuxième modale
    document.getElementById('addPhotoModal').style.display = 'none';
    // Réafficher la première modale
    document.getElementById('editProjectModal').style.display = 'block';
  });
});

// oups mettre en fonction
// Écouteur d'événement pour fermer la modale tout ce genre de choses devraient être dans une fonction et appelé à la fin
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('editProjectModal').style.display = 'none';
});


// Appel des fonctions

checkAuthentication();

fetchData();

processItem(item);

displayCategories();

filterWorksByCategory(selectedCategory);




