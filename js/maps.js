// Class Google Maps
class Maps {

	/*
	 * @param {HTMLelement} element
	 * @param {object} options
	 * @param {object} [option.lat = 43.4833] La latitude pour le positionement de la carte
	 * @param {object} [options.long = -1.4833] La longitude pour le positionement de la carte
	 */

	constructor (element, options = {}) {

	 	this.element = element
	 	this.options = Object.assign({}, {

	 		long : 43.4833,
	 		lat : -1.4833 
	 	})
	}

		// Parametre nom de CLASS
	initMap () {

		map = new google.maps.Map(document.getElementById('map'), {
			center : { lat: this.lat, long:this.long},
			zoom: 13
		})
	}
}



  new Maps(document.querySelector('map'), {
      
  })


