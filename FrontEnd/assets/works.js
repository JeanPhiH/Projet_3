
/** GENERATION DYNAMIQUE DE GALLERY **********/

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



/** AJOUT DYNAMIQUE DES BOUTONS FILTRES **********/

const categories = await fetch('http://localhost:5678/api/categories').then(res => res.json());

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
			})
			document.querySelector(".gallery").innerHTML = "";
			fetchWork(works_i);
		});
	}
}

fetchCategories();


// console.log(works);