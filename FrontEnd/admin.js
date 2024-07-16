document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Appel à la fonction de vérification des identifiants
    await handleLogin(email, password);
  });
});

async function handleLogin(email, password) {
  const errorMessage = document.getElementById('error-message');

  // Réinitialiser le message d'erreur
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';

  try {
    console.log('Sending request to server...');

    // Simuler une requête d'authentification
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Nom d\'utilisateur ou mot de passe incorrect.');
    }

    const data = await response.json();
    sessionStorage.setItem("token", data.token);

    console.log("clé récupéré :" + data.token);

    window.location.href = 'index.html';
  
    // Redirection vers la page d'accueil
  
  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
}
