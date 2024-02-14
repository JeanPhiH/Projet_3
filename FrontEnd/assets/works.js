//////////////////////////
// LOAD OF EDITION MODE //

let filters = document.querySelector(".filters");
// if a token is present in sessionStorage, execution of loadCreatorInterface()
if (sessionStorage.getItem("token")) {
	loadCreatorInterface();
}

function loadCreatorInterface() {
	let logstate = document.querySelector(".logstate");

	// deactivation of the login link
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
		}
	});
}
////////////////////////////////

////////////////////////////////
// DYNAMIC LOADING OF GALLERY //

const gallery = document.querySelector(".gallery");
const allWorks = await fetch("http://localhost:5678/api/works").then((res) =>
	res.json()
);
fetchWork(allWorks);

// fetch GET works in Gallery
function fetchWork(works) {
	gallery.innerHTML = "";
	for (let i = 0; i < works.length; i++) {
		const figure = document.createElement("figure");
		const img = document.createElement("img");
		img.src = works[i].imageUrl;
		img.alt = works[i].title;
		const figcaption = document.createElement("figcaption");
		figcaption.innerText = works[i].title;

		// add elements
		gallery.appendChild(figure);
		figure.appendChild(img);
		figure.appendChild(figcaption);
	}
}

/////////////////////////////////////

///////////////////////////////////////
// DYNAMIC ADDING OF FILTERS BUTTONS //

const categories = await fetch("http://localhost:5678/api/categories").then(
	(res) => res.json()
);

function fetchCategories() {
	// button TOUS to load all the works
	const tousButton = document.createElement("button");
	tousButton.innerText = "Tous";
	filters.appendChild(tousButton);
	tousButton.addEventListener("click", function () {
		gallery.innerHTML = "";
		fetchWork(allWorks);
	});

	for (let i = 0; i < categories.length; i++) {
		// creation of a button for each category
		const newButton = document.createElement("button");
		newButton.innerText = categories[i].name;
		filters.appendChild(newButton);

		// display of the filtered category
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

///////////////////
// MODAL GALLERY //

const modalGallery = document.querySelector(".modalGallery");

function fetchModale(works) {
	for (let i = 0; i < works.length; i++) {
		// creation of the following tree:
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

		// clic on trash icon id="i" -> del works[i]
		document
			.getElementById(`${i}`)
			.addEventListener("click", async function () {
				fetch("http://localhost:5678/api/works/" + works[i].id, {
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
				}).then((response) => {
					if (response.ok) {
						// deletion of the element from the modal gallery
						modalGallery.removeChild(modalWork);
					}
				});
				const updateWorks = await fetch("http://localhost:5678/api/works").then(
					(res) => res.json()
				);
				fetchWork(updateWorks);
			});
	}
}
////////////////////

//////////////////
// MODAL UPLOAD //

const uploadBox = document.querySelector(".uploadBox");
const btnUpload = document.querySelector(".btnUpload");
const inputFile = document.getElementById("inputFile");
const titleUpload = document.getElementById("titleUpload");
const catUpload = document.getElementById("catUpload");
const imgUpload = document.createElement("img");
imgUpload.classList.add("imgUpload");

// IMAGE UPLOAD
let imgSrc;
let imgUrl = inputFile.addEventListener("change", () => {
	const imgFile = inputFile.files[0];
	if (imgFile.size > 4000000) {
		alert("Le fichier est trop volumineux !");
		inputFile.value = "";
	} else {
		imgSrc = URL.createObjectURL(imgFile);
		imgUpload.src = imgSrc;
		uploadBox.innerText = "";
		uploadBox.style.height = "170px";
		uploadBox.appendChild(imgUpload);
		return imgSrc;
	}
});

// CATEGORIES UPLOAD

for (let i = 0; i < categories.length; i++) {
	// creation of <option> in <select> for each category
	const newOption = document.createElement("option");
	newOption.innerText = categories[i].name;
	newOption.value = categories[i].id;
	document.getElementById("catUpload").appendChild(newOption);
}

// Fetch POST to upload a new work
const btnSubmit = document.querySelector(".btnSubmit");
btnSubmit.addEventListener("click", async function (event) {
	event.preventDefault();
	let formData = new FormData();
	formData.append("title", titleUpload.value);
	formData.append("category", Number(catUpload.value));
	formData.append("image", inputFile.files[0]);

	await fetch("http://localhost:5678/api/works", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + sessionStorage.getItem("token"),
		},
		body: formData,
	})
		.then(async (response) => {
			// console.log("1er then: ", response);
			if (!response.ok) {
				throw new Error(response.status);
			}
			// console.log("1er then .json: ", response.json());
			// return response.json();
		})
		.catch((error) => {
			console.log(error);
		});
		inputFile.value = "";
		titleUpload.value = "";
		catUpload.value = "";
		modalUpload.classList.remove("active");
		modalBackground.classList.remove("active");
		gallery.innerHTML = "";
		const addWorks = await fetch("http://localhost:5678/api/works").then((res) =>
			res.json()
		);
		fetchWork(addWorks);
});
///////////////////

///////////////////
// MODAL BUTTONS //

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
