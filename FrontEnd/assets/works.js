/** CHARGEMENT DU MODE EDITION **********/

// si un token et présent dans le sessionStorage, on execute la fonction loadCreatorInterface()
if (sessionStorage.getItem("token")) {
	loadCreatorInterface();
}

function loadCreatorInterface() {
	let logstate = document.querySelector(".logstate");
	logstate.innerText = "Logout";
	// on désactive le lien vers login
	logstate.href = "#";
	// deconnection
	logstate.addEventListener("click", function () {
		sessionStorage.removeItem("token");
		window.location.href = "index.html";
	});
	let modeEdition = document.querySelector(".mode-edition");
	modeEdition.classList.add("active");
	let modifier = document.querySelector(".modifier");
	modifier.classList.add("active");
}

/** GENERATION DYNAMIQUE DE GALLERY **********/

const works = await fetch("http://localhost:5678/api/works").then((res) =>
	res.json()
);

function fetchWork(works) {
	for (let i = 0; i < works.length; i++) {
		// Récupération de l'élément du DOM qui accueillera les réalisations
		const gallery = document.querySelector(".gallery");

		// chaque réalisation dans une balise figure pour la sémantique
		const figure = document.createElement("figure");
		// figure.dataset.id = works[i].id
		const img = document.createElement("img");
		img.src = works[i].imageUrl;
		img.alt = works[i].title;
		const figcaption = document.createElement("figcaption");
		figcaption.innerText = works[i].title;

		// ajout des éléments créés à l'arborescence HTML
		gallery.appendChild(figure);
		figure.appendChild(img);
		figure.appendChild(figcaption);
	}
}

fetchWork(works);

/** AJOUT DYNAMIQUE DES BOUTONS FILTRES **********/

const categories = await fetch("http://localhost:5678/api/categories").then(
	(res) => res.json()
);

function fetchCategories() {
	// Bouton TOUS pour tout afficher
	const tousButton = document.createElement("button");
	tousButton.innerText = "Tous";
	document.querySelector(".filters").appendChild(tousButton);
	tousButton.addEventListener("click", function () {
		document.querySelector(".gallery").innerHTML = "";
		fetchWork(works);
	});

	for (let i = 0; i < categories.length; i++) {
		// on crée un bouton pour chaque catégorie
		const newButton = document.createElement("button");
		newButton.innerText = categories[i].name;
		document.querySelector(".filters").appendChild(newButton);

		// on affiche la catégorie filtrée
		newButton.addEventListener("click", function () {
			const works_i = works.filter(function (work) {
				return work.category.name === categories[i].name;
			});
			document.querySelector(".gallery").innerHTML = "";
			fetchWork(works_i);
		});
	}
}

fetchCategories();

/** AJOUT GALLERY DANS LA MODALE **********/

const modaleGallery = document.querySelector(".modaleGallery");
const modifier = document.querySelector(".modifier");
const modaleBackground = document.querySelector(".modaleBackground");
const croix = document.querySelector(".fa-xmark");

function fetchModale(works) {
	for (let i = 0; i < works.length; i++) {
		//on crée l'arboresscence suivante:
		//<div class="modaleWork"> <img src="imageUrl"> <div class="trash"> <i id="i" class="fa-solid fa-trash-alt"></i> </div> </div>
		const modaleWork = document.createElement("div");
		modaleWork.classList.add("modaleWork");

		const img = document.createElement("img");
		img.src = works[i].imageUrl;
		modaleWork.appendChild(img);

		const divTrash = document.createElement("div");
		divTrash.classList.add("trash");
		divTrash.id = `${i}`;

		const iTrash = document.createElement("i");
		iTrash.classList.add("fa-trash-alt");
		iTrash.classList.add("fa-solid");

		divTrash.appendChild(iTrash);
		modaleWork.appendChild(divTrash);
		modaleGallery.appendChild(modaleWork);

		// clic sur icone trash id="i" -> suppr works[i]
		document.getElementById(`${i}`).addEventListener("click", async function (e) {
			e.preventDefault();
			await fetch("http://localhost:5678/api/works/" + works[i].id, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
					"Content-Type": "application/json"
				}
			});
			modaleGallery.innerHTML = "";
			fetchModale(works);
		});
	};
};

// apuie sur le bouton "modifier" -> affiche la modale
modifier.addEventListener("click", function () {
	modaleBackground.classList.add("active");
	modaleGallery.innerHTML = "";
	fetchModale(works);
});

// appuie sur la croix -> ferme la modale
croix.addEventListener("click", function () {
	modaleBackground.classList.remove("active");
});

// appuie sur le background -> ferme la modale
modaleBackground.addEventListener("click", function (event) {
	if (event.target === modaleBackground) {
		modaleBackground.classList.remove("active");
	}
});

/** AFFICHAGE PAGE UPLOAD **********/

const btnAddPhoto = document.querySelector(".btnAddPhoto");
btnAddPhoto.addEventListener("click", function () {});

// console.log(works);
