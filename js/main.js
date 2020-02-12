
// Intégration des Objets JS

$(document).ready(function() {
	
	let slider = new Carousel(document.querySelector('#carousel'), {
	    slidesVisible: 2, // Nombres de Slides Visibles
	    slidesToScroll: 2,  // Nombres de Slides à faire defiler
	    animation: true, // Animation de Slide
	    loop: false,  // Lecture en Boucle
	    navigation: true,  // Bouton de Navigation
	    infinite: true,  // Boucle Infinie
	    play: false,  // Lecture Automatique
	    timer: 5000 // Timer en millisecondes
	})
	let map = new MapClass('#map_container', 'map', 43.6050, 1.4404, 12, 'https://api.jcdecaux.com/vls/v1/stations?contract=Toulouse&apiKey=0a5fb39e32787526595038c04a59ececb2b712ed')
	let reservation = new Reserv('#form_bikes', 20 * 60 * 1000, new CanvasClass('#canvas_div', '#canvas_resa'))
	
})


// Smooth scroll vers les ancres de la page 

$(document).ready(function() {
	$('.nav_links').on('click', function() { // Au clic sur un élément
		
		var page = $(this).attr('href'); // Page cible
		var speed = 750; // Durée de l'animation (en ms)

		$('html, body').animate( { 
				scrollTop: $(page).offset().top 
			}, speed ); // Go
		return;
	});
});


// Pop Up Réservation

$('#formConfirmButton').on('click', function() {

	$('#form_confirm').toggleClass('confirm_reveal')

})

// Form Container, Canvas & Expiration close buttons

$('#formContainerClose').on('click', function() {

	$('#form_container').css({
		display: 'none'
	});
})

$('#CanvasClose').on('click', function() {

	$('#canvas_container').css({
		display: 'none'
	});
	$('#form_confirm').css({
		display: 'block'
	})
})

$('#expClose').on('click', function() {

	$('#form_exp').css({
		display: 'none'
	});
})


