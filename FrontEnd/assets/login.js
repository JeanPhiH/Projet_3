//////////////////////
// AUTHENTIFICATION //

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

	// fetch POST to log if response ok
	fetch("http://localhost:5678/api/users/login", {
		method: "POST",
		headers: { "Content-Type": "application/json"},
		body: login_string
	}).then((response) => {
			if (response.ok) {
				return response.json()
			} else {
				let error = document.querySelector(".error");
				error.innerText = "Erreur dans l’identifiant ou le mot de passe !";
		}
	}).then((data) => {
					
		// token and userId storage
		sessionStorage.setItem("token", data.token);
		sessionStorage.setItem("userId", data.userId);
		window.location.href = "index.html";
	})
})
//////////////////////
