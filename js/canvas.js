/* Class CANVAS */

class CanvasClass {

	constructor(canvasDiv, canvas) {

		this.canvasDiv = $(canvasDiv)
		this.canvas = $(canvas)
		this.ctx = this.canvas[0].getContext("2d")
		this.topCanvas = this.canvas[0].getBoundingClientRect().top // Pixels par rapport au haut de la page
		this.leftCanvas = this.canvas[0].getBoundingClientRect().left // Pixels par rapport au coin gauche de la page
		this.x = this.leftCanvas // Position initiale = left 0 du canvas
		this.y = this.topCanvas // Position initiale = top 0 du canvas 
		this.x2 = 0
		this.y2 = 0 // Deuxiemes coordonnées
		this.canvasFilled = false
		this.canvasContainer = $('#canvas_container') // Fait le lien avec la classe Resa
		this.clear = $('#clear_canvas') //  Fait le lien avec la classe Resa
		this.submit = $('#submit_canvas') // Fait le lien avec la classe Resa
		this.click = function (e) { // Crée une fonction stable qui permet au OFF de fonctionner
			console.log("bougé")
			e.preventDefault() // Permet de ne pas déclancher d'évenement de souris si c'est en mode digital
			this.ctx.strokeStyle = 'grey'
			this.ctx.lineWidth = 4
			this.ctx.lineJoin = 'round'
			this.ctx.lineCap = 'round'
			this.ctx.beginPath()
			this.ctx.moveTo(this.x, this.y)
			this.ctx.lineTo(this.x2, this.y2)
			console.log(this.x, this.y, this.x2, this.y2)
			this.ctx.closePath()
			this.ctx.stroke()
			this.canvasFilled = true // Le canvas est rempli
			console.log("canvas rempli")
		}

		this.draw = this.click.bind(this) // Crée une nouvelle fonction attaché à la classe (this sera toujours dans le contexte de la classe)
		this.initSettings() // Lance les premières propriétés + events

	} // Constructor END

	initSettings() {

		this.canvas.on('mousedown', (e) => { // Au click
			console.log("MOUSEDOWN")
			this.canvas.on('mousemove', this.draw)
		})

		this.canvas.on('mouseup', (e) => { // Au click relevé
			this.canvas.off('mousemove', this.draw)
		})

		this.canvas.on('mouseleave', (e) => { // La souris à quitté le périmètre du canvas
			this.canvas.off('mousemove', this.draw)
		})

		this.canvas.on('mousemove', (e) => { // La souris bouge sur le canvas
			console.log("MOUSEMOVE")
			this.topCanvas = this.canvas[0].getBoundingClientRect().top // Coordonées X
			this.leftCanvas = this.canvas[0].getBoundingClientRect().left // Coordonées Y
			this.x2 = this.x
			this.y2 = this.y
			this.x = e.clientX - this.leftCanvas // Coordonées sur le viewport - leftCanvas
			this.y = e.clientY - this.topCanvas
		})


		// Gestion Tactile

		this.canvas.on('touchstart', (e) => {
			e.preventDefault()
			this.topCanvas = this.canvas[0].getBoundingClientRect().top
			this.leftCanvas = this.canvas[0].getBoundingClientRect().left
			this.x = e.touches[0].clientX - this.leftCanvas // Coordonées sur le viewport - leftCanvas
			this.y = e.touches[0].clientY - this.topCanvas
			this.canvas.on('touchmove', this.draw)
		})

		// Touche
		this.canvas.on('touchend', (e) => {
			e.preventDefault()
			this.canvas.off('touchmove', this.draw)
		})

		// Lache
		this.canvas.on('touchleave', (e) => {
			e.preventDefault()
			this.canvas.off('touchmove', this.draw)
		})

		// Bouge
		this.canvas.on('touchmove', (e) => {
			e.preventDefault()
			this.x2 = this.x
			this.y2 = this.y
			this.x = e.touches[0].clientX - this.leftCanvas // Coordonnées sur le viewport - leftCanvas
			this.y = e.touches[0].clientY - this.topCanvas
			console.log("TOUCHMOVE")
			console.log(this.x, this.y, this.x2, this.y2)
		})

		// Methode resize pour le responsive

		$(window).on('resize', (e) => {
			this.resize()
		})
	}

	resize() { // Adapte la taille du canvas à celle de sa div
		this.canvas.prop('width', this.canvasDiv.width())
		this.canvas.prop('height', this.canvasDiv.height())
	}
}