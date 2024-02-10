/** AUTHENTIFICATION **********/

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", function (event) {
	event.preventDefault();
	const inputEmail = event.target.querySelector("[name=email]");
	const inputPassword = event.target.querySelector("[name=password]");
	const login = {
		email: inputEmail.value,
		password: inputPassword.value
	};

	const login_string = JSON.stringify(login);

	fetch("http://localhost:5678/api/users/login", {
		method: "POST",
		headers: { "Content-Type": "application/json"},
		body: login_string
	}).then((response) => {
			if (response.ok) {
				response.json().then((data) => {
					sessionStorage.setItem("token", data.token);
					sessionStorage.setItem("userId", data.userId);
					window.location.href = "index.html";
				})
			} else {
				let error = document.querySelector(".error");
				error.innerText = "Erreur dans l’identifiant ou le mot de passe !";
			
		}
	})
})





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