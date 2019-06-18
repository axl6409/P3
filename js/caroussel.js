// Caroussel JS

// Class Caroussel
class Carousel {

	/**
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Object} options.slidesToScroll Nombres d'éléments à faire défiler
	 * @param {Object} options.slidesVisible Nombres d'éléments visibles dans un slide
	*/

	// Methode avec deux paramètres ou objet vide
	constructor (element, options = {}) {

		this.element = element // sauvegarde l'élément dans une variable "element"
		this.options = Object.assign({}, { // Création de la propriété "options" assigné à l'objet et les valeurs par default
			slidesToScroll: 1, // Propriétés par défault
			slidesVisible: 1
		}, options)

		this.children = [].slice.call(element.children) // Conserve les éléments enfant dans un tableau 
		let ratio = this.children.length / this.options.slidesVisible // Nous donne le nombre d'éléments dans le slide divisé par le nombre d'éléments visibles voulu
		let root = this.createDivWithClass('carousel') // Création d'une div avec la class carousel
		let container = this.createDivWithClass('carousel__container') // Création d'une div avec la class carousel__container
		container.style.width = ( ratio * 100 ) + "%" // Applique à mon container une largeur égale au "ratio" X 100 en %
		root.appendChild(container) // Insère la DIV carousel__container dans la DIV carousel
		this.element.appendChild(root) // Crée une DIV avec l'élément "root" dans l'élément #blocCarousel
		this.children.forEach((child) => { // Utilisation de la methode forEach sur mes éléments enfants
			let item = this.createDivWithClass('carousel__item') // Création de mes container parents avec la class createDivWidthClass
			item.style.width = ((100 / this.options.slidesVisible) / ratio ) + "%" // régle le style des items : l'élément visible divisé par le ratio sur 100 et on ajoute le pourcentage
			item.appendChild(child) // On rajoute les enfants dans les "items" 
			container.appendChild(item) // On rajoute les "items" dans le container
		})


	} 




	// Création de la methode pour créer mes div

	/**
	 * @param {string} className
	 * @returns {HTMLElement}
	*/

	// Parametre nom de CLASS
	createDivWithClass (className) {

		let div = document.createElement('div') // Ajoute un élément HTML de type DIV
		div.setAttribute('class', className) // lui ajoute l'attribut CLASS et en parametre de le nom de la CLASS
		return div
	}

}

// Attend le chargement du DOM
document.addEventListener('DOMContentLoaded', function () {

	// Création de la class carousel
	new Carousel(document.querySelector('#carousel'), {
		// Indique le nombre d'élément à faire defiler
		slidesToScroll: 3,
		slidesVisible: 3
	})
})
