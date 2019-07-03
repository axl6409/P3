// Objet for display the leaflet map

class MapClass {

	constructor(container, mapId, lat, lng, zoom, ajaxURL) {

		this.container = $(container)
		this.mapID = mapId
		this.latView = lat
		this.lngView = lng
		this.zoom = zoom
        this.ajaxURL = ajaxURL;
		this.map = L.map(mapId).setView([this.latView, this.lngView], this.zoom) // Initialisation de la map
		this.tilelayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXhsNjQwOSIsImEiOiJjanhlcW9sZDYwcG5kNDFsNzI1b3hzZGIwIn0.Pj1oOeEmXLyQ1-Scsi6Kow', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', // création du design de la map
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYXhsNjQwOSIsImEiOiJjanhlcW9sZDYwcG5kNDFsNzI1b3hzZGIwIn0.Pj1oOeEmXLyQ1-Scsi6Kow'
        });
		this.tilelayer.addTo(this.map) // Ajout du design de la map
		this.stationModel = { // Création de l'objet station

			init: function (name, address, positionlat, positionlng, banking, status, bikestands, availableBS, availableB, lastupdate) {
				this.name = name
                this.address = address
                this.position = {
                    lat: positionlat,
                    lng: positionlng
                };
                this.banking = banking 
                this.status = status
                this.bike_stands = bikestands
                this.available_bike_stands = availableBS
                this.available_bikes = availableB
                this.last_update = lastupdate
			}
		}

		this.greenIcon = L.icon({ // Définis l'icone verte de localisation de vélos
			iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
		})
		this.orangeIcon = L.icon({ // Définis l'icone orange de localisation de vélos
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
        })

        this.redIcon = L.icon({ // Définis l'icone rouge de localisation de vélos
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
        })
        this.document = $(document)
        this.regex = /......./; // enlève les chiffres et le tiret du nom de la station
        this.name = this.container.find('#name');
        this.firstname = this.container.find('#firstname');
        this.initSettings();
        

    } // fin du constructor


    initSettings() {
        this.document.ready( ($) => { // quand le DOM est prêt, on lance la méthode AJAX
            this.launchAjax();
        });
    }

    launchAjax() {
            $.ajax({
                url: this.ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {param1: 'value1'},
            })
            .done(function() {
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always( (response) => {
                console.log("complete");
                this.ajaxOK(response);
            });
        };

    ajaxOK(response) { // fonction qui se déclenche quand  l'appel AJAX s'est terminé avec succès
        let stations = response; // le tableau JS obtenu (jQuery traduit en JS)
        for (let station of stations) { // création d'une classe pour chaque station
            let newStation = Object.create(this.stationModel);
            newStation.init(station.name, station.address, station.position.lat, station.position.lng, station.banking, station.status, station.bike_stands, station.available_bike_stands, station.available_bikes, station.last_update);

            let myIcon = this.greenIcon; // au début de la boucle, l'icône est vert

            if (newStation.status === "CLOSED") { // si la station est FERMÉE
                newStation.available_bikes === 0; // elle n'a plus de vélos disponibles
            };
            
            if (newStation.available_bikes < 10) { // moins de 10 places restantes, il devient orange
                myIcon = this.orangeIcon;
                if (newStation.available_bikes === 0) { // à 0, il devient rouge
                    myIcon = this.redIcon;
                }
            }

            let newMarker = L.marker([newStation.position.lat, newStation.position.lng], {icon: myIcon}, {opacity: 1}, {bubblingMouseEvents: true}, {interactive: true});
            newMarker.bindPopup(newStation.name.replace(this.regex, 'STATION'));
            newMarker.addTo(this.map).on('click', (e) => {
                this.newMarkerClic(newStation);
            });
        };
    };

    newMarkerClic(newStation) {
        $('#before_form').remove()
        $('#form_container').prepend('<p id="before_form"></p>')
        $('#before_form').append(newStation.name.replace(this.regex, 'STATION'))
        $('#form_container').css('display', 'block') // Affiche le bloc d'infos de la station
        $('#station_infos p').html('') // Efface les dernières valeurs d'information
        $('#form_container form').css('display', 'none') // Efface le formulaire
        $('#nobikes').css('display', 'none') // Efface le message en cas de réservation impossible

        $('#station_infos p:first').append(`Adresse : ${newStation.address.toLowerCase()}`) // Remplissage de l'info : Adresse
        $('#station_infos p:eq(1)').append(`Nombre de places : ${newStation.bike_stands}`) // Remplissage de l'info : Nombre de places
        $('#station_infos p:last').append(`Nombre de vélos disponibles : ${newStation.available_bikes}`) // Remplissage de l'info : Nombres de vélos disponibles

        $('#canvas_container').css('display', 'none') // Supprime le canvas s'il est ouvert
        $('#form_confirm').css('display', 'none') // Efface le message de confirmation 
        $('#form_exp').css('display', 'none') // Efface le message d'expiration de réservation 

        if(newStation.available_bikes > 0) { // S'il y a des vélos disponibles alors
            $('#form_container form').css('display', 'block') // Affiche le formulaire 
            $('html, body').animate({ // pour les mobiles scrollDown jusqu'au formulaire
                scrollTop: $('#before_form').offset().top
            }, 1000)
        } else { // S'il n'y a pas de vélos disponibles :
            $('#nobikes').css('display', 'block') // Message : réservation impossible
            $('html, body').animate({ // pour les mobiles scrollDown jusqu'au formulaire
                scrollTop: $('#before_form').offset().top
            }, 1000)
        }
    }

    
}; // fin de la classe