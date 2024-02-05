/** AUTHENTIFICATION **********/

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const login = {
		email: event.target.querySelector("[name=email]").value,
		password: event.target.querySelector("[name=password]").value
	};
	const login_string = JSON.stringify(login);
	fetch("http://http://localhost:5678/api/users/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: login_string
	});
});



// Lorsque le couple identifiant et mot de passe n’est pas bon pour se connecter il faut afficher le message d’erreur:

// “Erreur dans l’identifiant ou le mot de passe”

// Lorsque le couple identifiant et mot de passe est correct, alors il faut rediriger vers la page du site avec cette fois ci des boutons d’actions pour éditer le site.
