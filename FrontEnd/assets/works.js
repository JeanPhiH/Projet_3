////////////////////////////////
// CHARGEMENT DU MODE EDITION //

let filters = document.querySelector(".filters");
// si un token et présent dans le sessionStorage, on execute la fonction loadCreatorInterface()
if (sessionStorage.getItem("token")) {
	loadCreatorInterface();
}

function loadCreatorInterface() {
	let logstate = document.querySelector(".logstate");
	
	// on désactive le lien vers login
	logstate.innerText = "Logout";
	logstate.href = "#";

	// deconnection
	let modeEdition = document.querySelector(".mode-edition");
	modeEdition.classList.add("active");
	let modifier = document.querySelector(".modifier");
	modifier.classList.add("active");
	filters.classList.add("hidden");
	logstate.addEventListener("click", function () {
		if (logstate.innerText === "Logout") {
			sessionStorage.clear();
			filters.classList.remove("hidden");
			window.location.href = "index.html";
		};
	});
}
////////////////////////////////



/////////////////////////////////////
// GENERATION DYNAMIQUE DE GALLERY //
const gallery = document.querySelector(".gallery");
const allWorks = await fetch("http://localhost:5678/api/works")
.then((res) => res.json());
fetchWork(allWorks);

function fetchWork(works) {
	gallery.innerHTML="";
	for (let i = 0; i < works.length; i++) {
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

/////////////////////////////////////



/////////////////////////////////////////
// AJOUT DYNAMIQUE DES BOUTONS FILTRES //

const categories = await fetch("http://localhost:5678/api/categories").then(
	(res) => res.json()
);

function fetchCategories() {
	// Bouton TOUS pour tout afficher
	const tousButton = document.createElement("button");
	tousButton.innerText = "Tous";
	filters.appendChild(tousButton);
	tousButton.addEventListener("click", function () {
		gallery.innerHTML = "";
		fetchWork(allWorks);
	});

	for (let i = 0; i < categories.length; i++) {
		// on crée un bouton pour chaque catégorie
		const newButton = document.createElement("button");
		newButton.innerText = categories[i].name;
		filters.appendChild(newButton);

		// on affiche la catégorie filtrée
		newButton.addEventListener("click", function () {
			const works_i = allWorks.filter(function (work) {
				return work.category.name === categories[i].name;
			});
			gallery.innerHTML = "";
			fetchWork(works_i);
		});
	}
}

fetchCategories();
/////////////////////////////////////////



////////////////////
// MODALE GALLERY //

const modalGallery = document.querySelector(".modalGallery");

function fetchModale(works) {
	for (let i = 0; i < works.length; i++) {
		//on crée l'arboresscence suivante:
		//<div class="modalWork"> <img src="imageUrl"> <div class="trash"> <i id="i" class="fa-solid fa-trash-alt"></i> </div> </div>
		const modalWork = document.createElement("div");
		modalWork.classList.add("modalWork");

		const img = document.createElement("img");
		img.src = works[i].imageUrl;
		modalWork.appendChild(img);

		const divTrash = document.createElement("div");
		divTrash.classList.add("trash");
		divTrash.id = `${i}`;

		const iTrash = document.createElement("i");
		iTrash.classList.add("fa-trash-alt");
		iTrash.classList.add("fa-solid");

		divTrash.appendChild(iTrash);
		modalWork.appendChild(divTrash);
		modalGallery.appendChild(modalWork);

		// clic sur icone trash id="i" -> suppr works[i]
		document.getElementById(`${i}`).addEventListener("click", function () {
			// e.preventDefault();
			fetch("http://localhost:5678/api/works/" + works[i].id, {
				method: "DELETE",
				headers: {
					Authorization: "Bearer " + sessionStorage.getItem("token"),
					"Content-Type": "application/json"
				}
			})
			.then((response) => {
				if (response.ok) {
					// on supprime l'element de la gallery
					modalGallery.removeChild(modalWork);
					fetchWork(works);
				}
			});
		});
	};
};
////////////////////



///////////////////
// MODALE UPLOAD //

// IMAGE UPLOAD

const uploadBox = document.querySelector(".uploadBox")
const btnUpload = document.querySelector(".btnUpload");
const inputFile = document.getElementById("inputFile");
const imgUpload = document.createElement("img");
imgUpload.classList.add("imgUpload");
let imgSrc;

let imgUrl = inputFile.addEventListener('change', () => {
	const imgFile = inputFile.files[0];
	imgSrc = URL.createObjectURL(imgFile);
	imgUpload.src = imgSrc;
	uploadBox.innerText = "";
	uploadBox.style.height = "170px";
	uploadBox.appendChild(imgUpload);
});

// CATEGORIES UPLOAD

for (let i = 0; i < categories.length; i++) {
	// on crée une option dans select pour chaque catégorie
	const newOption = document.createElement("option");
	newOption.innerText = categories[i].name;
	newOption.value = categories[i].name;
	document.getElementById("catUpload").appendChild(newOption);
}

// Fetch post pour upload nouveau travail
const btnSubmit = document.querySelector(".btnSubmit");
btnSubmit.addEventListener("click", function (event) {
	event.preventDefault();
	const newWork = {
		title: document.getElementById("titleUpload").value,
		// category: {name: document.getElementById("catUpload").value},
		category: 2,
		imageUrl: imgSrc
	};
	const newWork_string = JSON.stringify(newWork);
	// const formData = new FormData();
	// formData.append('title', newWork.title);
	// formData.append('category', newWork.category.name);
	// formData.append('imageUrl', newWork.imageUrl);
	fetch("http://localhost:5678/api/works", {
		method: "POST",
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: "Bearer " + sessionStorage.getItem("token")
		},
		body: newWork_string
	})
	.then(response => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error('File upload failed');
		}
	})
	.then(data => {
		console.log('Server response:', data);
	})
	.catch(error => {
		console.error('Error uploading file:', error);
	});
	modalUpload.classList.remove("active");
	modalGallery.innerHTML = "";
	fetchModale(allWorks);
});	
///////////////////



/////////////////////
// BOUTONS MODALES //

// appuie sur le bouton "modifier" -> affiche la modale
const modifier = document.querySelector(".modifier");
const modalWindow = document.querySelector(".modalWindow");
modifier.addEventListener("click", function () {
	modalBackground.classList.add("active");
	modalWindow.classList.add("active");
	modalGallery.innerHTML = "";
	fetchModale(allWorks);
});

// appuie sur la croix -> ferme la modale
const exitMW = document.querySelector(".exitModalWindow");
exitMW.addEventListener("click", function () {
	modalBackground.classList.remove("active");
	modalWindow.classList.remove("active");
	modalUpload.classList.remove("active");
});

// appuie sur le background -> ferme la modale
const modalBackground = document.querySelector(".modalBackground");
modalBackground.addEventListener("click", function (event) {
	if (event.target === modalBackground) {
		modalBackground.classList.remove("active");
		modalWindow.classList.remove("active");
		modalUpload.classList.remove("active");
	}
});

// appuie sur Ajouter une photo -> ouvre 2nde modale
const modalUpload = document.querySelector(".modalUpload");
const btnAddPhoto = document.querySelector(".btnAddPhoto");
btnAddPhoto.addEventListener("click", function () {
	modalWindow.classList.remove("active");
	modalUpload.classList.add("active");
});

// croix 2nde modale -> ferme modale
const exitMA = document.querySelector(".exitModalUpload");
exitMA.addEventListener("click", function () {
	modalBackground.classList.remove("active");
	modalWindow.classList.remove("active");
	modalUpload.classList.remove("active");
});

// fleche retour -> revient sur 1ere modale
const retour = document.querySelector(".fa-arrow-left");
retour.addEventListener("click", function () {
	modalWindow.classList.add("active");
	modalUpload.classList.remove("active");
});
/////////////////////



// console.log(allWorks);
