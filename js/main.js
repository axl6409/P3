

$(document).ready(function() {
	
	let slider = new Carousel(document.querySelector('#carousel'), {
	    slidesVisible: 3, // Nombres de Slides Visibles
	    slidesToScroll: 1,  // Nombres de Slides à faire defiler
	    loop: true,  // Lecture en Boucle
	    navigation: true,  // Bouton de Navigation
	    infinite: true  // Boucle infinie
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