
/** GENERATION GALLERY **********/

const works = await fetch('http://localhost:5678/api/works').then(res => res.json());


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

/** BOUTONS FILTRES **********/

const btnTous = document.querySelector(".btn-tous");
const btnObjets = document.querySelector(".btn-objets");
const btnApparts = document.querySelector(".btn-apparts");
const btnHotels = document.querySelector(".btn-hotels");

btnTous.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    fetchWork(works);
});

btnObjets.addEventListener("click", function () {
	const worksObjets = works.filter(function (work) {
		return work.category.name === "Objets";
	})
	document.querySelector(".gallery").innerHTML = "";
	fetchWork(worksObjets);
});

btnApparts.addEventListener("click", function () {
	const worksApparts = works.filter(function (work) {
		return work.category.name === "Appartements";
	})
	document.querySelector(".gallery").innerHTML = "";
	fetchWork(worksApparts);
});

btnHotels.addEventListener("click", function () {
	const worksHotels = works.filter(function (work) {
		return work.category.name === "Hotels & restaurants";
	})
	document.querySelector(".gallery").innerHTML = "";
	fetchWork(worksHotels);
});




console.log(works);