// Caroussel JS

// Class Caroussel
class Caroussel {

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

		this.children = [].slice.call(element.children)
		let ratio = this.children.lenght / this.options.slidesVisible
		let root = this.createDivWithClass('carousel') // Création d'une div avec la class carousel
		let container = this.createDivWithClass('carousel__container') // Création d'une div avec la class carousel__container
		container.style.width = ( ratio * 100 ) + "%"
		root.appendChild(container) // Insère la DIV carousel__container dans la DIV carousel
		this.element.appendChild(root) // Crée une DIV avec l'élément "root" dans l'élément #blocCarousel
		this.children.forEach((child) => {
			let item = this.createDivWithClass('carousel__item')
			item.style.width = ((100 / this.options.slidesVisible) / ratio ) + "%"
			item.appendChild(child)
			container.appendChild(item)
		})
	}




	// Création de la methode pour créer mes div

	/**
	 * @param {string} className
	 * @returns {HTMLElement}
	*/

	// Parametre nom de CLASSs
	createDivWithClass (className) {

		let div = document.createElement('div') // Ajoute un élément HTML de type DIV
		div.setAttribute('class', className) // lui ajoute l'attribut CLASS et en parametre de le nom de la CLASS
		return div
	}

}

// Attend le chargement du DOM
document.addEventListener('DOMContentLoaded', function () {

	// Création de la class carousel
	new Caroussel(document.querySelector('#blocCarousel'), {
		// Indique le nombre d'élément à faire defiler
		slidesToScroll: 3,
		slidesVisible: 3
	})
})
