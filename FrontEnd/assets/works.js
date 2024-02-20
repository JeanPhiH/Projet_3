////////////////////////////////
// DYNAMIC LOADING OF GALLERY //

const gallery = document.querySelector(".gallery");

// fetch GET works in Gallery
function fetchWork() {
	fetch("http://localhost:5678/api/works")
		.then((res) => res.json())
		.then((works) => {
			generateGallery(works);
		});
}

// Generate the gallery
function generateGallery(works) {
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


/////////////////////////////
// DYNAMIC FILTERS BUTTONS //

async function fetchCategories() {
	let works = await fetch("http://localhost:5678/api/works").then((res) =>
		res.json()
	);

	// fetch GET all the categories
	fetch("http://localhost:5678/api/categories")
		.then((res) => res.json())
		.then((categories) => {

			// button TOUS to load all the works
			const tousButton = document.createElement("button");
			tousButton.innerText = "Tous";
			filters.appendChild(tousButton);

			// click on TOUS -> display all the works
			tousButton.addEventListener("click", function () {
				fetchWork();
			});
			for (let i = 0; i < categories.length; i++) {

				// creation of a button for each category
				const newButton = document.createElement("button");
				newButton.innerText = categories[i].name;
				filters.appendChild(newButton);

				// display of the filtered category
				newButton.addEventListener("click", function () {
					const works_i = works.filter(function (work) {
						return work.category.name === categories[i].name;
					});
					generateGallery(works_i);
				});
			}
		});
}
/////////////////////////////////////////

/////////////////////////////
// LOADING OF EDITION MODE //

let filters = document.querySelector(".filters");

// if a token is present in sessionStorage, execution of loadCreatorInterface()
if (sessionStorage.getItem("token")) {
	loadCreatorInterface();
} else {
	filters.classList.add("active");
	fetchWork();
	fetchCategories();
}

function loadCreatorInterface() {
	filters.classList.remove("active");
	// deactivation of the login link
	let logstate = document.querySelector(".logstate");
	logstate.innerText = "Logout";
	logstate.href = "#";

	fetchWork();

	// deconnection
	let modeEdition = document.querySelector(".mode-edition");
	modeEdition.classList.add("active");
	let modifier = document.querySelector(".modifier");
	modifier.classList.add("active");
	logstate.addEventListener("click", function () {
		if (logstate.innerText === "Logout") {
			sessionStorage.clear();
			window.location.href = "index.html";
		}
	});
}
////////////////////////////////

///////////////////
// MODAL GALLERY //

const modalGallery = document.querySelector(".modalGallery");

function generateModalGallery(works) {
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
		divTrash.dataset.trashid = `${i}`;

		const iTrash = document.createElement("i");
		iTrash.classList.add("fa-trash-alt");
		iTrash.classList.add("fa-solid");

		divTrash.appendChild(iTrash);
		modalWork.appendChild(divTrash);
		modalGallery.appendChild(modalWork);

		// fetch DELETE: click on trash icon id="i" -> del works[i]
		document
			.querySelector(`.trash[data-trashid="${i}"]`)
			.addEventListener("click", async function () {
				await fetch("http://localhost:5678/api/works/" + works[i].id, {
					method: "DELETE",
					headers: {
						Authorization: "Bearer " + sessionStorage.getItem("token"),
						"Content-Type": "application/json",
					},
				}).then((response) => {
					if (response.ok) {
						// delete the element from the modal gallery
						modalGallery.removeChild(modalWork);
					}
				});
				fetchWork();
			});
	}
}

function fetchModal() {
	modalGallery.innerHTML = "";
	fetch("http://localhost:5678/api/works")
		.then((res) => res.json())
		.then((works) => {
			generateModalGallery(works);
		});
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
	} else if (imgFile.type !== "image/jpeg" && imgFile.type !== "image/png") {
		alert("Seuls les formats .jpg et .png sont acceptés !");
		inputFile.value = "";
	} else {
		imgSrc = URL.createObjectURL(imgFile);
		imgUpload.src = imgSrc;
		Array.from(uploadBox.children).forEach((child) => {
			child.classList.add("hidden");
		});
		uploadBox.style.height = "170px";
		uploadBox.appendChild(imgUpload);
		return imgSrc;
	}
});

// CATEGORIES UPLOAD
function uploadCategories() {
	catUpload.innerHTML = "";
	let tousOption = document.createElement("option");
	tousOption.innerText = "";
	tousOption.value = "";
	tousOption.disabled = true;
	tousOption.selected = true;
	catUpload.appendChild(tousOption);
	fetch("http://localhost:5678/api/categories")
		.then((res) => res.json())
		.then((categories) => {
			for (let i = 0; i < categories.length; i++) {
				// creation of <option> in <select> for each category
				const newOption = document.createElement("option");
				newOption.innerText = categories[i].name;
				newOption.value = categories[i].id;
				document.getElementById("catUpload").appendChild(newOption);
			}
		});
}

// button "Valider" activation
let modalForm = document.querySelector(".modalForm");
const btnSubmit = document.querySelector(".btnSubmit");
modalForm.addEventListener("input", function () {
	if (
		!titleUpload.value == "" &&
		!catUpload.value == "" &&
		!inputFile.value == ""
	) {
		btnSubmit.classList.add("btnSubmitValid");
	}
});

// VERIFYING FORM DATAS
btnSubmit.addEventListener("click", function (event) {
	event.preventDefault();
	resetFormErrorMessages();
	let inputData = document.querySelectorAll(".inputdata");
	let label = ["Fichier", "Titre", "Categorie"];
	for (let i = 0; i < inputData.length; i++) {
		if (inputData[i].value == "") {
			inputData[i].previousElementSibling.innerText = label[i] + " OBLIGATOIRE";
			inputData[i].previousElementSibling.style.color = "red";
		}
	}
	let formData = new FormData();
	formData.append("title", titleUpload.value);
	formData.append("category", Number(catUpload.value));
	formData.append("image", inputFile.files[0]);
	fetchPost(formData);
});

// Fetch POST to upload a new work
async function fetchPost(formData) {
	await fetch("http://localhost:5678/api/works", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + sessionStorage.getItem("token"),
		},
		body: formData,
	})
		.then(async (response) => {
			if (response.ok) {
				console.log(titleUpload.value + " ajouté à la galerie.");
				imgUpload.remove();
				Array.from(uploadBox.children).forEach((child) => {
					child.classList.remove("hidden");
				});
				inputFile.value = "";
				titleUpload.value = "";
				catUpload.value = "";
				btnSubmit.classList.remove("btnSubmitValid");
				modalUpload.classList.remove("active");
				modalBackground.classList.remove("active");
				fetchWork();
				fetchModal();
			} else {
				console.log("Erreur dans le formulaire");
			}
		})
		.catch((error) => {
			console.log(error);
		});
}

///////////////////

///////////////////
// MODAL BUTTONS //

// button "modifier" -> open modal gallery
const modifier = document.querySelector(".modifier");
const modalWindow = document.querySelector(".modalWindow");
modifier.addEventListener("click", function () {
	modalBackground.classList.add("active");
	modalWindow.classList.add("active");
	modalGallery.innerHTML = "";
	fetchModal();
});

// cross click -> close the modal
const exitMW = document.querySelector(".exitModalWindow");
exitMW.addEventListener("click", function () {
	modalBackground.classList.remove("active");
	modalWindow.classList.remove("active");
	modalUpload.classList.remove("active");
});

// background click -> close the modal
const modalBackground = document.querySelector(".modalBackground");
modalBackground.addEventListener("click", function (event) {
	if (event.target === modalBackground) {
		modalBackground.classList.remove("active");
		modalWindow.classList.remove("active");
		modalUpload.classList.remove("active");
	}
});

// click on "Ajouter une photo" -> open modal upload
const modalUpload = document.querySelector(".modalUpload");
const btnAddPhoto = document.querySelector(".btnAddPhoto");
btnAddPhoto.addEventListener("click", function () {
	modalWindow.classList.remove("active");
	modalUpload.classList.add("active");

	// reset of possible changes in modal upload
	// like unfinished form or error messages
	imgUpload.remove();
	Array.from(uploadBox.children).forEach((child) => {
		child.classList.remove("hidden");
	});
	inputFile.value = "";
	titleUpload.value = "";
	catUpload.value = "";
	btnSubmit.classList.remove("btnSubmitValid");
	resetFormErrorMessages();
	uploadCategories();
});

// reset error messages of the upload modal
function resetFormErrorMessages() {
	btnUpload.innerText = "+ Ajouter photo";
	btnUpload.style.color = "black";
	document.querySelector("label[for='titleUpload']").innerText = "Titre";
	document.querySelector("label[for='titleUpload']").style.color = "black";
	document.querySelector("label[for='catUpload']").innerText = "Categorie";
	document.querySelector("label[for='catUpload']").style.color = "black";
}

// modal upload cross -> close the modal
const exitMA = document.querySelector(".exitModalUpload");
exitMA.addEventListener("click", function () {
	modalBackground.classList.remove("active");
	modalWindow.classList.remove("active");
	modalUpload.classList.remove("active");
});

// left arrow -> return on modal gallery
const retour = document.querySelector(".fa-arrow-left");
retour.addEventListener("click", function () {
	modalWindow.classList.add("active");
	modalUpload.classList.remove("active");
});
/////////////////////

