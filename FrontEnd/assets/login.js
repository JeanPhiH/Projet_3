/** AUTHENTIFICATION **********/

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const email = event.target.querySelector("[name=email]");
	const password = event.target.querySelector("[name=password]");
	const login = {
		email: email.value,
		password: password.value
	};
	console.log(login);

	if (login.email === "sophie.bluel@test.tld" && login.password === "S0phie") {
		// go to url
		alert("Connexion reussie");
		window.location.href = "index.html";
		// ajout d'éléments
	} else if (login.email !== "sophie.bluel@test.tld" || login.password !== "S0phie") {
		let error = document.getElementById("error");
		error = document.createElement("p");
		error.id = "error";
		
		// on vide les champs
		event.email.value = "";
		event.password.value = "";
		// on affiche le message d'erreur
		loginForm.appendChild(error);
		error.innerText = "Erreur dans l’identifiant ou le mot de passe";
	}


	// const login_string = JSON.stringify(login);
	// console.log(login_string);
	// fetch("http://localhost:5678/api/users/login", {
	// 	method: "POST",
	// 	headers: { "Content-Type": "application/json"},
	// 	body: login_string
	// }).then((response) => response.json())
	// .then((data) => {
	// 	console.log(data);
	// })
		
});



// "Authorization": "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
// Lorsque le couple identifiant et mot de passe n’est pas bon pour se connecter il faut afficher le message d’erreur:

// “Erreur dans l’identifiant ou le mot de passe”

// Lorsque le couple identifiant et mot de passe est correct, alors il faut rediriger vers la page du site avec cette fois ci des boutons d’actions pour éditer le site.

// {
//   "email": "sophie.bluel@test.tld",
//   "password": "S0phie"
// }

// {
//   "userId": 1,
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
// }