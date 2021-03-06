// Objet for display the leaflet map

class MapClass {

	constructor(container, mapId, lat, lng, zoom, ajaxURL) {

        // Contructor Options
		this.container = $(container)     // Container principal de la carte
		this.mapID = mapId                // Id de la carte
		this.latView = lat                // Latitude
		this.lngView = lng                // Longitude
		this.zoom = zoom                  // Règlage du Zoom sur la carte 
        this.ajaxURL = ajaxURL;           // URL api JCDecaux

        // Map Init Settings
		this.map = L.map(mapId).setView([this.latView, this.lngView], this.zoom) // Initialisation de la map avec : Latitude / Longitude et Zoom
		this.tilelayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYXhsNjQwOSIsImEiOiJjanhlcW9sZDYwcG5kNDFsNzI1b3hzZGIwIn0.Pj1oOeEmXLyQ1-Scsi6Kow', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', // création du design de la map
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiYXhsNjQwOSIsImEiOiJjanhlcW9sZDYwcG5kNDFsNzI1b3hzZGIwIn0.Pj1oOeEmXLyQ1-Scsi6Kow'
        });
		this.tilelayer.addTo(this.map) // Ajout des calques de titres à la map
		this.stationModel = { // Création de l'objet station

			init: function (name, address, positionlat, positionlng, status, availableBS, availableB) {
				this.name = name            // Nom de la station
                this.address = address      // Adresse de la station
                this.position = {
                    lat: positionlat,       // Latitude de la station
                    lng: positionlng        // Longitude de la station
                };
                this.status = status        // indique l'état de la station
                this.available_bike_stands = availableBS   // nombres de stands pour vélo disponibles
                this.available_bikes = availableB   // nombres de vélos disponibles
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
        this.document = $(document)  // Cible la page
        this.replace = /......./; // enlève les chiffres et le tiret du nom de la station
        this.name = this.container.find('#name');  // Cible le container name
        this.firstname = this.container.find('#firstname');  // Cible le container firstname
        this.initSettings();  // Appel methode initSettings
        

    } // fin du constructor


    // Initialisation du lancement de la methode AJAX, lorsque le document est prêt
    initSettings() {
        this.document.ready( ($) => { // quand le DOM est prêt, on lance la méthode AJAX
            this.launchAjax();  // Appel de la methode launchAjax
        });
    }

    // Lancement de la requête AJAX
    launchAjax() {
            $.ajax({
                url: this.ajaxURL, // Ressource ciblée
                type: 'GET',       // Type de la requete HTTP
                dataType: 'json',  // Type de données à recevoir : ici JSON
            })

            // Requete AJAX effectuée avec Succes
            .done(function() {
                console.log("success");
            })
            // Requete AJAX à échouée
            .fail(function() {
                console.log("error");
            })
            // Requete Ajax est completée
            .always( (response) => {
                console.log("complete");
                this.ajaxOK(response);
            });
        };

    // Construction des stations avec les résultats de la requete AJAX
    ajaxOK(response) {
        let stations = response; // le tableau JS obtenu (jQuery traduit en JS)

        for (let station of stations) { // création d'une classe pour chaque station

            // Création du modele de station
            let newStation = Object.create(this.stationModel);
            newStation.init(
                station.name, 
                station.address, 
                station.position.lat, 
                station.position.lng, 
                station.status, 
                station.available_bike_stands, 
                station.available_bikes);

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

            // Creation d'un nouveau marqueur
            let newMarker = L.marker(
                             [newStation.position.lat, newStation.position.lng],
                             {icon: myIcon}, 
                             {opacity: 1},  
                            );
            newMarker.bindPopup(newStation.name.replace(this.replace, '')); // Affiche le nom de la station sur le marqueur, sur la carte
            newMarker.addTo(this.map).on('click', (e) => {
                this.newMarkerClic(newStation); // Appel de la methode newMarkerClick, au click sur une icone de station
            });
        };
    };

    // Modification du DOM
    newMarkerClic(newStation) {
        $('#before_form h2').html('') 
        $('#before_form h2').append(newStation.name.replace(this.replace, '     ')) // ajoute des espaces, à la place des tirets et chiffres du nom de la station
        $('#form_container').css('display', 'block') // Affiche le bloc d'infos de la station
        $('#station_infos p').html('') // Efface les dernières valeurs d'information
        $('#form_container form').css('display', 'none') // Efface le formulaire
        $('#nobikes').css('display', 'none') // Efface le message en cas de réservation impossible
        $('#station_infos p:first').append(`Adresse : ${newStation.address.toLowerCase()}`) // Remplissage de l'info : Adresse
        $('#station_infos p:eq(1)').append(`Nombre de stands disponibles : ${newStation.available_bike_stands}`) // Remplissage de l'info : Nombre de places
        $('#station_infos p:last').append(`Nombre de vélos disponibles : ${newStation.available_bikes}`) // Remplissage de l'info : Nombres de vélos disponibles
        $('#canvas_container').css('display', 'none') // Supprime le canvas s'il est ouvert
        $('#form_confirm').css('bottom', 'none') // Efface le message de confirmation 
        $('#form_exp').css('display', 'none') // Efface le message d'expiration de réservation 
        if(newStation.available_bikes > 0) { // S'il y a des vélos disponibles alors
            $('#form_container form').css('display', 'block') // Affiche le formulaire 
        } else { // S'il n'y a pas de vélos disponibles :
            $('#nobikes').css('display', 'block') // Message : réservation impossible
        }
    }

}; // fin de la classe