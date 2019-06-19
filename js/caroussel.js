// Class Caroussel
class Carousel {

	/**
	 * This callback type is called 'requestCallback' and is displayed as a global symbol.
	 *
	 * @callback moveCallback
	 * @param {number} index
	 */

	/**
	 * @param {HTMLElement} element
	 * @param {Object} options
	 * @param {Object} [options.slidesToScroll = 1] Nombres d'éléments à faire défiler
	 * @param {Object} [options.slidesVisible = 1] Nombres d'éléments visibles dans un slide
	 * @param {boolean} [options.loop = false] Doit-on boucler en fin de carousel
	*/

	// Methode avec deux paramètres ou objet vide
	constructor (element, options = {}) {

		this.element = element // sauvegarde l'élément dans une variable "element"
		this.options = Object.assign({}, { // Création de la propriété "options" assigné à l'objet et les valeurs par default
			slidesToScroll: 1, // Propriétés par défault
			slidesVisible: 1,
			loop: false
		}, options)

		let children = [].slice.call(element.children) // Conserve les éléments enfant dans un tableau
		this.isMobile = false
		this.currentItem = 0
		this.moveCallbacks = []

		// Modification du DOM
		this.root = this.createDivWithClass('carousel') // Création d'une div avec la class carousel
		this.container = this.createDivWithClass('carousel__container') // Création d'une div avec la class carousel__container
		this.root.setAttribute('tabindex', '0')
		this.root.appendChild(this.container) // Insère la DIV carousel__container dans la DIV carousel
		this.element.appendChild(this.root) // Crée une DIV avec l'élément "root" dans l'élément #blocCarousel
		this.items = children.map((child) => { // Utilisation de la methode forEach sur mes éléments enfants
			let item = this.createDivWithClass('carousel__item') // Création de mes container parents avec la class createDivWidthClass
			
			item.appendChild(child) // On rajoute les enfants dans les "items" 
			this.container.appendChild(item) // On rajoute les "items" dans le container
			return item
		})
		this.setStyle()
		this.createNavigation()

		// Evenements
		this.moveCallbacks.forEach(cb => cb(0))
		this.onWindowResize()
		window.addEventListener('resize', this.onWindowResize.bind(this)) // Vérifie le redimensionnement de la fenetre pour le responsive du carousel
		this.root.addEventListener('keyup', e => {
			if (e.key === 'ArrowRight' || e.key === 'Right') {
				this.next()
			} else if (e.key === 'ArrowLeft' || e.key === 'Left') {
				this.prev()
			}
		})
	} 

	// Applique les bonnes dimensions aux éléments du carousel
	setStyle () {
		let ratio = this.items.length / this.slidesVisible // Nous donne le nombre d'éléments dans le slide divisé par le nombre d'éléments visibles voulu
		this.container.style.width = ( ratio * 100 ) + "%" // Applique à mon container une largeur égale au "ratio" X 100 en %
		this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio ) + "%" )// régle le style des items : l'élément visible divisé par le ratio sur 100 et on ajoute le pourcentage
	}

	// Methode de création de la navigation dans le DOM
	createNavigation() {
		let nextButton = this.createDivWithClass('carousel__next')
		let prevButton = this.createDivWithClass('carousel__prev')
		this.root.appendChild(nextButton)
		this.root.appendChild(prevButton)
		nextButton.addEventListener('click', this.next.bind(this))
		prevButton.addEventListener('click', this.prev.bind(this))
		if (this.options.loop === true) {
			return
		}
		this.onMove(index => {
			if (index === 0) {
				prevButton.classList.add('carousel__prev--hidden')
			} else {
				prevButton.classList.remove('carousel__prev--hidden')
			}

			if (this.items[this.currentItem + this.slidesVisible] === undefined) {
				nextButton.classList.add('carousel__next--hidden')
			} else {
				nextButton.classList.remove('carousel__next--hidden')
			}

		})


	}

	next () {
		this.gotoItem(this.currentItem + this.slidesToScroll)
	}

	prev () {
		this.gotoItem(this.currentItem - this.slidesToScroll)
	}

	/**
	 * Déplace le carousel vers l'élément ciblé
	 * @param {number} index
	 */

	gotoItem (index) {
		
		if (index < 0) {
			if (this.options.loop) {
				index = this.items.length - this.slidesVisible
			} else {
				return
			}
		} else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
			if (this.options.loop) {
				index = 0
			} else {
				return
			}
		}
		let translateX = index * -100 / this.items.length
		this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
		this.currentItem = index
		this.moveCallbacks.forEach(cb => cb(index))

	} 


	

	/**
	 *
	 * @param {moveCallback} cb
	 */

	onMove (cb) {
		this.moveCallbacks.push(cb)
	}


	onWindowResize () {
		let mobile = window.innerWidth < 800
		if (mobile !== this.isMobile) {
			this.isMobile = mobile
			this.setStyle()
			this.moveCallbacks.forEach(cb => cb(this.currentItem))
		}

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

	/**
	 *
	 * @returns {number}
	 */

	get slidesToScroll () {
		return this.isMobile ? 1 : this.options.slidesToScroll
	}


	/**
	 *
	 * @returns {number}
	 */

	get slidesVisible () {
		return this.isMobile ? 1 : this.options.slidesVisible
	}

}

// Attend le chargement du DOM
document.addEventListener('DOMContentLoaded', function () {

	// Création de la class carousel
	new Carousel(document.querySelector('#carousel'), {
		slidesVisible: 1,
      	slidesToScroll: 1,
      	loop: false
	})
})
