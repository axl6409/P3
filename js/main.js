

$(document).ready(function() {
	
	let slider = new Carousel(document.querySelector('#carousel'), {
	    slidesVisible: 3,
	    slidesToScroll: 1,
	    loop: true,
	    navigation: true,
	    infinite: true
	})
	let map = new MapClass('#map_container', 'map', 43.6050, 1.4404, 12, 'https://api.jcdecaux.com/vls/v1/stations?contract=Toulouse&apiKey=0a5fb39e32787526595038c04a59ececb2b712ed')
	let canvas = new Canvas('#canvis_div', '#canvas_resa')
})