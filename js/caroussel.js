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
	 * @param {boolean} [options.infinite = false] 
	 * 
	*/

	// Methode avec deux paramètres ou objet vide
	constructor (element, options = {}) {

		this.element = element // sauvegarde l'élément dans une variable "element"
		this.options = Object.assign({}, { // Création de la propriété "options" assigné à l'objet et les valeurs par default
			// Propriétés par défault 
			slidesToScroll: 1, 
			slidesVisible: 1,
			loop: false,
		    pagination: false,
		    navigation: true,
		    infinite: false
		}, options)

		let children = [].slice.call(element.children) // Conserve les éléments enfant dans un tableau
		this.isMobile = false // Est-on sur Mobile ?
		this.currentItem = 0
		this.moveCallbacks = [] // Sauvegarde les callbacks dans une instance
		this.offset = 0

		// Modification du DOM
		this.root = this.createDivWithClass('carousel') // Création d'une div avec la class carousel
		this.container = this.createDivWithClass('carousel__container') // Création d'une div avec la class carousel__container
		this.root.setAttribute('tabindex', '0') // Ajoute un nouvel attribut a root et définis la navigation par les fleches du clavier
		this.root.appendChild(this.container) // Insère la DIV carousel__container dans la DIV carousel
		this.element.appendChild(this.root) // Crée une DIV avec l'élément "root" dans l'élément #blocCarousel
		this.items = children.map((child) => { // Utilisation de la methode forEach sur mes éléments enfants
			let item = this.createDivWithClass('carousel__item') // Création de mes container parents avec la class createDivWidthClass
			
			item.appendChild(child) // On rajoute les enfants dans les "items" 

			return item
		})
		if (this.options.infinite) {
			this.offset = this.options.slidesVisible + this.options.slidesToScroll // Récupere les items hors champs
			if (this.offset > children.length) {
		       console.error("Vous n'avez pas assez d'élément dans le carousel", element)
		    }
			this.items = [
				...this.items.slice(this.items.length - this.offset).map(item => item.cloneNode(true)), 
				...this.items,
				...this.items.slice(0, this.offset).map(item => item.cloneNode(true)),
			]
			this.gotoItem(this.offset, false)
			
		}

		this.items.forEach(item => this.container.appendChild(item)) // On rajoute les "items" dans le container
		this.setStyle()
	    if (this.options.navigation) {
	      this.createNavigation()
	    }
	    if (this.options.pagination) {
	      this.createPagination()
	    }

		// Evenements
		this.moveCallbacks.forEach(cb => cb(this.currentItem))
		this.onWindowResize() // Appel de la methode pour redimensionement sur mobile
		window.addEventListener('resize', this.onWindowResize.bind(this)) // Vérifie le redimensionnement de la fenetre pour le responsive du carousel
		this.root.addEventListener('keyup', e => { // Ajoute un evenement au relachement des touches du clavier
			if (e.key === 'ArrowRight' || e.key === 'Right') { // Definis la touche flêche de droite
				this.next() // Lui passe la methode next
			} else if (e.key === 'ArrowLeft' || e.key === 'Left') { // Definis la touche flêche de gauche
				this.prev() // Lui passe la methode prev
			}
		})
		if (this.options.infinite) {
	      this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
	    }

	} 

	// Applique les bonnes dimensions aux éléments du carousel
	setStyle () {
		let ratio = this.items.length / this.slidesVisible // Nous donne le nombre d'éléments dans le slide divisé par le nombre d'éléments visibles voulu
		this.container.style.width = ( ratio * 100 ) + "%" // Applique à mon container une largeur égale au "ratio" X 100 en %
		this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio ) + "%" )// régle le style des items : l'élément visible divisé par le ratio sur 100 et on ajoute le pourcentage
	}

	// Methode de création de la navigation dans le DOM
	createNavigation() {
		let nextButton = this.createDivWithClass('carousel__next') // Crée le bouton next
		let prevButton = this.createDivWithClass('carousel__prev') // Crée le bouton prev
		let playButton = this.createDivWithClass('carousel__play') // Crée le bouton play
		this.root.appendChild(nextButton) // Place le bouton next dans le carousel
		this.root.appendChild(prevButton) // Place le bouton prev dans le carousel
		this.root.appendChild(playButton) // Place le bouton play dans le carousel
		nextButton.addEventListener('click', this.next.bind(this)) // Ajoute un evenement sur le bouton, au click et effectue la methode next
		prevButton.addEventListener('click', this.prev.bind(this)) // Ajoute un evenement sur le bouton, au click et effectue la methode prev
		playButton.addEventListener('click', this.play.bind(this)) // Ajoute un evenement sur le bouton, au click et effectue la methode play
		if (this.options.loop === true) { 
			return
		}
		// Appel de la methode onMove, en parametre
		this.onMove(index => {

			// Supprime ou affiche le bouton prev
			if (index === 0) { // Si l'index est égal à zero 
				prevButton.classList.add('carousel__prev--hidden') // Rajoute la CLASS hidden
			} else {
				prevButton.classList.remove('carousel__prev--hidden') // Supprime la CLASS hidden
			}
			// Supprime ou affiche le bouton suivant
			if (this.items[this.currentItem + this.slidesVisible] === undefined) {
				nextButton.classList.add('carousel__next--hidden')
			} else {
				nextButton.classList.remove('carousel__next--hidden')
			}

		})


	}


	  /**
	   * Crée la pagination dans le DOM
	   */
	  createPagination () {
	    let pagination = this.createDivWithClass('carousel__pagination')
	    let buttons = []
	    this.root.appendChild(pagination)
	    for (let i = 0; i < (this.items.length - 2 * this.offset); i = i + this.options.slidesToScroll) {
	      let button = this.createDivWithClass('carousel__pagination__button')
	      button.addEventListener('click', () => this.gotoItem(i + this.offset))
	      pagination.appendChild(button)
	      buttons.push(button)
	    }
	    this.onMove(index => {
	      let count = this.items.length - 2 * this.offset
	      let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.options.slidesToScroll)]
	      if (activeButton) {
	        buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
	        activeButton.classList.add('carousel__pagination__button--active')
	      }
	    })
	  }

	/*
	 *
	 * Methodes pour les boutons next et prev
	 *
	 */

	next () {
		this.gotoItem(this.currentItem + this.slidesToScroll) // Appel de la methode gotoItem
	}

	prev () {
		this.gotoItem(this.currentItem - this.slidesToScroll) 
	}

	play () {
		
		
		// let i
		// let slides = this.items
		// for (i = 0; i < slides.length; i++) {
		// 	this.gotoItem(this.currentItem + this.slidesToScroll)
		// }
	}


	/**
	 *
	 * Déplace le carousel vers l'élément ciblé
	 * @param {number} index
	 * @param {boolean} [animation = true]
	 *
	 */

	gotoItem (index, animation = true) {
	    if (index < 0) { // Si l'index est inférieur à 0 il faut revenir en arrière
		    if (this.options.loop) {
		        index = this.items.length - this.slidesVisible // L'index alors le nombres d'éléments moins le nombres d'éléments visibles
		    } else {
		        return
		    }
		// Si l'index est supérieur ou égal aux nombres d'éléments, ou currentItem + le nombres de slides visibles et vérifie si un item correspond
	    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
	      	if (this.options.loop) {
	        	index = 0  // Alors l'index reviens à zero
	      	} else {
	        	return
	      	}
	    }
	    // Animation de slide vers l'élément 
	    let translateX = index * -100 / this.items.length
	    if (animation === false) {
	      	this.container.style.transition = 'none'
	    }
	    this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)' // Aplique l'alination translate3d avec X,Y,Z en parametre
	    this.container.offsetHeight // force repaint
	    if (animation === false) {
	      	this.container.style.transition = ''
	    }
	    this.currentItem = index // Définis l'élément comme index
	    this.moveCallbacks.forEach(cb => cb(index)) // Appel des callbacks les uns après les autres avec en l'index courant en parametre

	  }


	  /**
	   * Déplace le container pour donner l'impression d'un slide infini
	   */
	  resetInfinite () {
	    if (this.currentItem <= this.options.slidesToScroll) {
	      this.gotoItem(this.currentItem + (this.items.length - 2 * this.offset), false)
	    } else if (this.currentItem >= this.items.length - this.offset) {
	      this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false)
	    }
	  }
	

	/**
	 *
	 * @param {moveCallback} cb
	 */

	onMove (cb) {
		this.moveCallbacks.push(cb) // Ajoute les callbacks dans mon instance tableau
	}

	/*
	 *
	 * Methode pour le responsive du carousel
	 *
	 */


	onWindowResize () {
		let mobile = window.innerWidth < 800 // Déclare la variable mobile qui cible la fenetre avec une largeur inferieure à 800px
		if (mobile !== this.isMobile) { // Si la valeur de mobile est differente de celle de this.isMobile
			this.isMobile = mobile // Change la valeur de la propriété d'instance
			this.setStyle() // Aplique le style
			this.moveCallbacks.forEach(cb => cb(this.currentItem)) // Rappel des callBacks avec l'item courant
		}
	}

	/**
	 *
	 * Création de la methode pour créer mes div
	 * @param {string} className
	 * @returns {HTMLElement}
	 *
	 */

	// Parametre nom de CLASS
	createDivWithClass (className) {

		let div = document.createElement('div') // Ajoute un élément HTML de type DIV
		div.setAttribute('class', className) // lui ajoute l'attribut CLASS et en parametre de le nom de la CLASS
		return div
	}

	/**
	 * Nombre d'éléments à faire defiler
	 * @returns {number}
	 */

	get slidesToScroll () {
		return this.isMobile ? 1 : this.options.slidesToScroll // Si le support est un mobile alors on retourne 1 ou sinon le parametre slidesToScroll
	}


	/**
	 * Nombres d'éléments à afficher
	 * @returns {number}
	 */

	get slidesVisible () {
		return this.isMobile ? 1 : this.options.slidesVisible // Si le support est un mobile alors on retourne 1 ou sinon le parametre slidesVisibles
	}

}

let onReady = function () {

  new Carousel(document.querySelector('#carousel'), {
      slidesVisible: 1,
      slidesToScroll: 1,
      loop: false,
      infinite: true,
      pagination: true
  })

}

if (document.readyState !== 'loading') {
  onReady()
}
document.addEventListener('DOMContentLoaded', onReady)
