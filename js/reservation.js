

class Reserv {

	constructor(form, timer, canvas) {

		this.form = $(form)
		this.timer = timer
		this.canvas = canvas
		this.beforeForm = $('#before_form')
		this.formName = this.form.find('#name')
		this.formFirstName = this.form.find('#firstname')
		this.intervalResa = null
		this.stopTimer = null
		this.regexResa = /......../
		this.documentHeight = $(document).height()
		this.initSettings()
	} // Fin du Constructor

	initSettings() {

		$(document).ready(($) => {

			if (this.storageAvailable('localStorage')) {
				console.log("LocalStorage est disponible")
			} else {
				console.log("LocalStorage n'est pas disponible")
			}

			if (!localStorage.name) {
				console.log("Veuillez renseigner vos identifiants")
			} else {
				this.setStyles()
			}

			if (!sessionStorage.stopTimer) {
				console.log("Pas de réservation en cours")
			} else {
				console.log("Une réservation est en cours ...")
				this.stopTimer = sessionStorage.stopTimer
				console.log(this.stopTimer)
				$('#form_confirm').css('display', 'block')
				$('#confirm_station').html(`${sessionStorage.station}`)
				$('#confirm_name').html(`${localStorage.firstname} ${localStorage.name}`)

				this.loopTimer()

				this.documentHeight = $(document).height()
				$('html, body').animate({
					scrollTop: this.documentHeight
				}, 1000)
			}
		})

		this.form.submit((event) => {
			event.preventDefault()
			console.log("Formulaire Validé")
			this.canvas.canvasContainer.css('display', 'block')
			this.canvas.resize()
			this.beforeForm = $('#before_form')
			$('#confirm_station').html(this.beforeForm.text().replace(this.regexResa, ''))
			$('#confirm_name').html(`${this.formFirstName.val()} ${this.formName.val()}`)
			clearInterval(this.intervalResa)
			$('#timer').html("")
			this.documentHeight = $(document).height()
			$('html, body').animate({
				scrollTop: $("#canvas_message").offset().top
			}, 1000)
		})

		this.canvas.clear.click((e) => {
			console.log("appuyé")
			clearInterval(this.intervalResa)
			$('#timer').html("")
			this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width(), this.canvas.canvas.height())
			this.canvas.canvasFilled = false
		})

		this.canvas.submit.click((e) => {
			e.preventDefault()
			if (!this.canvas.canvasFilled) {
				alert("Il manque votre signature")
			} else {
				this.stopTimer = new Date().getTime() + this.timer
				sessionStorage.stopTimer = this.stopTimer
				console.log(this.stopTimer)

				this.populateStorage()
				this.loopTimer()

				$('#form_confirm').css('display', 'block')
				this.documentHeight = $(document).height()

				$('html, body').animate({
					scrollTop: this.documentHeight
				}, 1000)

				$(window).on('beforeunload', (event) => {
					event.preventDefault()
					console.log("Do you really want to close the ")
				})
			}
		})
	}

	storageAvailable(type) {
		try {
			let storage = window[type]
				x = '__storage_test__'
			storage.setItem(x, x)
			storage.removeItem(x)
			return true
		}
		catch(e) {
			return false
		}
	}

	loopTimer() {
		this.intervalResa = setInterval( () => {
			let startTimer = new Date().getTime()
			let distance = this.stopTimer - startTimer
			let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			let seconds = Math.floor((distance % (1000 * 60)) / 1000)
			$('#timer').html(`${minutes}m ${seconds}s`)

			if (distance < 0) {
				clearInterval(this.intervalResa)
				$('#form_confirm').css('display', 'none')
				$('#form_exp').css('display', 'block')
				sessionStorage.clear()
			}
		}, 1000)
	}

	populateStorage() {
		localStorage.name = this.formName.val()
		localStorage.firstname = this.formFirstName.val()
		sessionStorage.station = $('#confirm_station').text()

		console.log(`Prenom et Nom : ${localStorage.getItem('firstname')} ${localStorage.getItem('name')} réservé à la station ${sessionStorage.getItem('station')}`)
		
		this.setStyles()
	}

	setStyles() {
		let currentName = localStorage.name
		let currentFirstName = localStorage.firstname
		let currentStation = sessionStorage.station

		this.formName.val(currentName)
		this.formFirstName.val(currentFirstName)
		$('#confirm_station').html(currentStation)
		console.log(`${currentFirstName} ${currentName}`)
	}
}