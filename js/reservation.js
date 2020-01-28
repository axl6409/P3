

class Reserv {

	// Constructeur
	constructor(form, timer, canvas) {

		// Parametres
		this.form = $(form) 		// Container principal du formulaire
		this.timer = timer 			// Initialisation du timer
		this.canvas = canvas 		// Objet Canvas

		// DOM
		this.beforeForm = $('#before_form') // Container du nom de la station affiché au dessus de la carte
		this.formName = this.form.find('#name') // Le nom entré dans le formualire
		this.formFirstName = this.form.find('#firstname') // Le prénom entré dans le formulaire

		// Reservation Informations
		this.intervalResa = null  // L'intervale de reservation pour le timer
		this.stopTimer = null // Timer de la réservation
		this.regexResa = /......../ // Le remplacement des caracteres et numéros présents avant le nom de la station
		this.documentHeight = $(document).height()
		this.initSettings()
	} // Fin du Constructor

	// Initialisation des réglages pour la réservation
	initSettings() {

		// Quand la page est prête
		$(document).ready(($) => {

			// Verification disponibilité de LocalStorage
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
				$('#form_confirm').css('display', 'block')
				$('#confirm_station').html(`<h2 class="station_name"> ${sessionStorage.station} </h2>`)
				$('#confirm_name').html(`${localStorage.firstname} ${localStorage.name}`)
				console.log(sessionStorage.station)
				this.loopTimer()
			}
		})

		// Evenement à la soumission du formulaire
		this.form.submit((event) => {
			event.preventDefault()
			console.log("Formulaire Validé")
			this.canvas.canvasContainer.css('display', 'block')
			$('#form_confirm').css('display','none')
			$('#timer').html("")
		})

		// Evenement au nettoyage du canvas
		this.canvas.clear.click((e) => {
			console.log("appuyé")			
			this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width(), this.canvas.canvas.height())
			this.canvas.canvasFilled = false
		})

		// Evenement à la soumission du canvas
		this.canvas.submit.click((e) => {
			e.preventDefault()
			if (!this.canvas.canvasFilled) { // Si le canvas n'est pas remplis
				alert("Il manque votre signature")
			} else { // Le canvas est remplis

				clearInterval(this.intervalResa) // Nettoyage du timer


				$('#confirm_station').html(this.beforeForm.text().replace(this.regexResa, ''))
				$('#confirm_name').html(`${this.formFirstName.val()} ${this.formName.val()}`)
				this.stopTimer = new Date().getTime() + this.timer
				
				sessionStorage.stopTimer = this.stopTimer
				console.log(this.stopTimer)

				this.populateStorage() 
				this.loopTimer()

				$('#form_confirm').css('display', 'block')
				$('#canvas_container').css('display', 'none')


			}
		})

		window.onbeforeunload = function() {
		    return "";
		 };
	}

	storageAvailable(type) {
		var storage
		try {
			storage = window[type]
			var	x = '__storage_test__'
			storage.setItem(x, x)
			storage.removeItem(x)
			return true
		}
		catch(e) {
	        return e instanceof DOMException && (
	            // everything except Firefox
	            e.code === 22 ||
	            // Firefox
	            e.code === 1014 ||
	            // test name field too, because code might not be present
	            // everything except Firefox
	            e.name === 'QuotaExceededError' ||
	            // Firefox
	            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') && // Exception déclanché si le quota de stokage est atteint
	            // acknowledge QuotaExceededError only if there's something already stored
	            (storage && storage.length !== 0)
	    }
	}

	loopTimer() {
		this.intervalResa = setInterval( () => {
			let startTimer = new Date().getTime()
			let distance = this.stopTimer - startTimer // Difference entre la date et heure actuelle avec les 20 minutes et celle de getTime
			let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) // Nombre total de minutes (en millisecondes)
			let seconds = Math.floor((distance % (1000 * 60)) / 1000) // Nombre total de secondes (en millisecondes)
			$('#timer').html(`${minutes}m ${seconds}s`) // Retourne un timer avec les minutes et secondes

			// Si le timer arrive à zéro
			if (distance < 0) {  
				clearInterval(this.intervalResa) // Nettoyage des informations de la réservation: Station, Timer, Nom Prenom
				$('#form_confirm').css('display', 'none') // Enleve le formulaire de confirmation de la réservation
				$('#form_exp').css('display', 'block') // Affiche la popup de réservation expirée
				sessionStorage.clear() // Nettoyage du sessionStorage
			}
		}, 1000)
	}

	// Stockage des informations du formulaire dans localStorage et sessionStorage
	populateStorage() { 
		localStorage.name = this.formName.val() // Stockage du nom dans "Local"
		localStorage.firstname = this.formFirstName.val() // Stockage du prenom dans "Local"
		sessionStorage.station = $('#confirm_station').text() // Stockage du nom de la station dans "Session"
		console.log(sessionStorage.station)
		console.log(`Prenom et Nom : ${localStorage.getItem('firstname')} ${localStorage.getItem('name')} réservé à la station ${sessionStorage.getItem('station')}`)
		
		this.setStyles()
	}

	setStyles() {
		let currentName = localStorage.name // Le nom de la personne
		let currentFirstName = localStorage.firstname // Le prénom de la personne

		// Les valeurs à insérer pour la prochaine saisie
		this.formName.val(currentName) // Le champ 'nom' du formulaire
		this.formFirstName.val(currentFirstName) // Le champ 'prénom' du formulaire
		
		console.log(`${currentFirstName} ${currentName}`)
	}
}