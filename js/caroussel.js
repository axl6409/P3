// Caroussel JS

// Objet Caroussel
class Caroussel {

	/**
	 * @param (HTMLElement) element
	 * @param (Object) options
	 * @param (Object) options.slidesToScroll Nombres d'éléments à faire défiler
	 * @param (Object) options.slidesVisible Nombres d'éléments visibles dans un slide
	*/

	// Methode
	constructor (element, options = {}) {
		this.element = element
		this.options = Object.assign({}, { 
			slidesToScroll: 1,
			slidesVisible: 1
		}, options)
		this.children = [].slice.call(element.children)
		let ratio = this.children.lenght / this.options.slidesVisible
		let root = this.createDivWithClass('carousel')
		let container = this.createDivWithClass('carousel__container')
		container.style.width = ( ratio * 100 ) + "%"
		root.appendChild(container)
		this.element.appendChild(root)
		this.children.forEach((child) => {
			let item = this.createDivWithClass('carousel__item')
			item.style.width = ((100 / this.options.slidesVisible) / ratio ) + "%"
			item.appendChild(child)
			container.appendChild(item)
		})
		debugger
	}


	/**
	 * @param (string) className
	 * @returns (HTMLElement)
	*/

	createDivWithClass (className) {
		let div = document.createElement('div')
		div.setAttribute('class', className)
		return div
	}

}

document.addEventListener('DOMContentLoaded', function () {

	new Caroussel(document.querySelector('#carousel'), {
		slidesToScroll: 3,
		slidesVisible: 3
	})
})
