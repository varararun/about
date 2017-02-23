let About = {
	initialize: () => {
		About.loadEvents();
	},
	loadEvents: () => {
		About.loadInstafeed();
		About.loadParallax();
		About.loadGoogleMaps();
		// About.loadGithubActivity();
	},
	loadParallax: () => {
		$(window).on('scroll', () => {
			window.requestAnimationFrame(() => {
				let scrolled = $(window).scrollTop();
				$('.splash-img').css({
					'transform': 'translate3d(0,' + scrolled * -0.3 + 'px, 0)'
				});
			});
		});
	},
	loadGoogleMaps: () => {
		google.maps.event.addDomListener(window, 'load', init);
		let map, markersArray = [];

		function bindInfoWindow(marker, map, location) {
			google.maps.event.addListener(marker, 'click', function () {
				function close(location) {
					location.ib.close();
					location.infoWindowVisible = false;
					location.ib = null;
				}

				if (location.infoWindowVisible === true) {
					close(location);
				} else {
					markersArray.forEach(function (loc, index) {
						if (loc.ib && loc.ib !== null) {
							close(loc);
						}
					});

					let boxText = document.createElement('div');
					boxText.style.cssText = 'background: #fff;';
					boxText.classList.add('md-whiteframe-2dp');

					function buildPieces(location, el, part, icon) {
						if (location[part] === '') {
							return '';
						} else if (location.iw[part]) {
							switch (el) {
								case 'photo':
									if (location.photo) {
										return '<div class="iw-photo" style="background-image: url(' + location.photo + ');"></div>';
									} else {
										return '';
									}
									break;
								case 'iw-toolbar':
									return '<div class="iw-toolbar"><h3 class="md-subhead">' + location.title + '</h3></div>';
									break;
								case 'div':
									switch (part) {
										case 'email':
											return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><span><a href="mailto:' + location.email + '" target="_blank">' +
												location.email + '</a></span></div>';
											break;
										case 'web':
											return '<div class="iw-details"><i class="material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><span><a href="' + location.web + '" target="_blank">' + location.web_formatted +
												'</a></span></div>';
											break;
										case 'desc':
											return '<label class="iw-desc" for="cb_details"><input type="checkbox" id="cb_details"/><h3 class="iw-x-details">Details</h3><i class="material-icons toggle-open-details"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><p class="iw-x-details">' + location.desc + '</p></label>';
											break;
										default:
											return '<div class="iw-details"><i class="material-icons"><img src="//cdn.mapkit.io/v1/icons/' +
												icon + '.svg"/></i><span>' + location[part] + '</span></div>';
											break;
									}
									break;
								case 'open_hours':
									let items = '';
									for (let i = 0; i < location.open_hours.length; ++i) {
										if (i !== 0) {
											items += '<li><strong>' + location.open_hours[i].day + '</strong><strong>' + location.open_hours[
												i].hours + '</strong></li>';
										}
										let first = '<li><label for="cb_hours"><input type="checkbox" id="cb_hours"/><strong>' +
											location.open_hours[0].day + '</strong><strong>' + location.open_hours[0].hours +
											'</strong><i class="material-icons toggle-open-hours"><img src="//cdn.mapkit.io/v1/icons/keyboard_arrow_down.svg"/></i><ul>' +
											items + '</ul></label></li>';
									}
									return '<div class="iw-list"><i class="material-icons first-material-icons" style="color:#4285f4;"><img src="//cdn.mapkit.io/v1/icons/' +
										icon + '.svg"/></i><ul>' + first + '</ul></div>';
									break;
							}
						} else {
							return '';
						}
					}

					boxText.innerHTML =
						buildPieces(location, 'photo', 'photo', '') +
						buildPieces(location, 'iw-toolbar', 'title', '') +
						buildPieces(location, 'div', 'address', 'location_on') +
						buildPieces(location, 'div', 'web', 'public') +
						buildPieces(location, 'div', 'email', 'email') +
						buildPieces(location, 'div', 'tel', 'phone') +
						buildPieces(location, 'div', 'int_tel', 'phone') +
						buildPieces(location, 'open_hours', 'open_hours', 'access_time') +
						buildPieces(location, 'div', 'desc', 'keyboard_arrow_down');

					let myOptions = {
						alignBottom: true,
						content: boxText,
						disableAutoPan: true,
						maxWidth: 0,
						pixelOffset: new google.maps.Size(-140, -40),
						zIndex: null,
						boxStyle: {
							opacity: 1,
							width: '280px'
						},
						closeBoxMargin: '0px 0px 0px 0px',
						infoBoxClearance: new google.maps.Size(1, 1),
						isHidden: false,
						pane: 'floatPane',
						enableEventPropagation: false
					};

					location.ib = new InfoBox(myOptions);
					location.ib.open(map, marker);
					location.infoWindowVisible = true;
				}
			});
		}

		function init() {
			let mapOptions = {
				center: new google.maps.LatLng(35.29943588555779, -93.84887800000001),
				zoom: 3,
				gestureHandling: 'auto',
				fullscreenControl: false,
				zoomControl: true,
				disableDoubleClickZoom: true,
				mapTypeControl: false,
				scaleControl: true,
				scrollwheel: false,
				streetViewControl: false,
				draggable: true,
				clickableIcons: false,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				styles: About.mapStyle
			}
			let mapElement = document.getElementById('mapkit-google-map');
			let map = new google.maps.Map(mapElement, mapOptions);
			let locations = About.locations;
			for (i = 0; i < locations.length; i++) {
				marker = new google.maps.Marker({
					icon: locations[i].marker,
					position: new google.maps.LatLng(locations[i].lat, locations[i].lng),
					map: map,
					title: locations[i].title,
					address: locations[i].address,
					desc: locations[i].desc,
					tel: locations[i].tel,
					int_tel: locations[i].int_tel,
					vicinity: locations[i].vicinity,
					open: locations[i].open,
					open_hours: locations[i].open_hours,
					photo: locations[i].photo,
					time: locations[i].time,
					email: locations[i].email,
					web: locations[i].web,
					iw: locations[i].iw
				});
				markersArray.push(marker);

				if (locations[i].iw.enable === true) {
					bindInfoWindow(marker, map, locations[i]);
				}
			}
		}
	},
	loadInstafeed: () => {
		About.instaFeed = new Instafeed({
			target: "ig-feed",
			get: 'user',
			userId: 232162132,
			accessToken: '232162132.62a228a.96de27b918d8401a858301d776a4aecb',
			limit: 6,
			sortBy: 'most-recent',
			after: () => { },
			links: true,
			resolution: "low_resolution",
			template: `
					<a href="{{link}}" target="_blank">
						<div class="ig-img" style="background-image:url('http:{{image}}')"/>
						</div>
					</a>						
			`
		});
		About.instaFeed.run();
	},
	loadGithubActivity: () => {
		githubActivity.feed({
			username: "vararun",
			selector: "#github-feed",
			limit: 20
		});
	}
	instaFeed: {},
	mapStyle: [{
        "stylers": [{
            "hue": "#ff1a00"
        }, {
            "invert_lightness": true
        }, {
            "saturation": -100
        }, {
            "lightness": 33
        }, {
            "gamma": 0.5
        }]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2D333C"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#eeeeee"
        }, {
            "visibility": "simplified"
        }]
    }, {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ffffff"
        }, {
            "weight": 3
        }]
    }, {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#2D333C"
        }]
    }],
	locations: [
        { "title": "Miami", "address": "Miami, FL, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 25.7616798, "lng": -80.19179020000001, "photo": "https://lh5.googleusercontent.com/-GSzLY3aPbTc/WJt-bQqIGnI/AAAAAAAAAQc/alJKlT57Q2Qj3PJqPm3cddcWihldjGDkgCLIB/w1280-h853-k/", "vicinity": "Miami", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Thiruvananthapuram", "address": "Thiruvananthapuram, Kerala, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1109", "lat": 8.524139100000001, "lng": 76.93663760000004, "photo": "https://lh3.googleusercontent.com/-rTPHgyZCSN0/V6IEj_7-W0I/AAAAAAAAHVY/MHLQoLyzY3Iu86JVMSQ4vYBR_S-elAOjwCJkC/w1280-h853-k/", "vicinity": "Thiruvananthapuram", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Kerala", "address": "Kerala, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1109", "lat": 10.8505159, "lng": 76.27108329999999, "photo": "https://lh4.googleusercontent.com/-aZvOd-9hWbs/V4TzwXWb9-I/AAAAAAAAFiI/zFtHH1qiqMkMAYbC5h04bcCxw8ltRtQIwCJkC/w1280-h853-k/", "vicinity": "Kerala, India", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Konni", "address": "Konni, Kerala 689691, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1109", "lat": 9.2267063, "lng": 76.84967789999996, "photo": "https://lh5.googleusercontent.com/-2LVcVioDHVs/V4-zb7DGpRI/AAAAAAAAEiA/gP3r9OUA8vwFu_ERKATzqEbUUj-vSvq8ACJkC/w1280-h853-k/", "vicinity": "Konni, Kerala 689691, India", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Pathanapuram", "address": "Pathanapuram, Kerala, India", "desc": "http://imgur.com/1V2NW", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1109", "lat": 9.092691599999998, "lng": 76.86124100000006, "photo": "https://lh5.googleusercontent.com/-lH_mXzqTBAA/V_JMutoIKoI/AAAAAAAACWg/V9WMK6AekAQphxFoKaEECvjb_zVpDisGwCJkC/w1280-h853-k/", "vicinity": "Pathanapuram, Kerala, India", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Bengaluru", "address": "Bengaluru, Karnataka, India", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1109", "lat": 12.9715987, "lng": 77.59456269999998, "photo": "https://lh4.googleusercontent.com/--eVmoOYuq40/WG89rFDYBRI/AAAAAAAAXgE/eKk20RUl3jgqsbsdfTwKvVRfdQVd9cpDQCLIB/w1280-h853-k/", "vicinity": "Bengaluru, Karnataka, India", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Abu Dhabi", "address": "Abu Dhabi - United Arab Emirates", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0939", "lat": 24.453884, "lng": 54.37734380000006, "photo": "https://lh4.googleusercontent.com/-fQiKsAksofQ/V6LxenslGzI/AAAAAAAAAkg/MB6q6KtQ8wArU1Cz0oz1GtMvE-zWq7ohACJkC/w1280-h853-k/", "vicinity": "Abu Dhabi - United Arab Emirates", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Puerto Vallarta", "address": "Puerto Vallarta, Jalisco, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 20.65340699999999, "lng": -105.2253316, "photo": "https://lh6.googleusercontent.com/-ms2s3TUZnwg/WHEe21rHucI/AAAAAAAACig/gaTbesGLMPYCkCyErXuTM_2GIOQQK3OhQCLIB/w1280-h853-k/", "vicinity": "Puerto Vallarta, Jalisco, Mexico", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Carrollton", "address": "Carrollton, TX, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 32.9756415, "lng": -96.88996359999999, "photo": "https://lh3.googleusercontent.com/-cfuLPiNagj8/VzPWbt4PYOI/AAAAAAAABxg/eDjQvvEhF_4DXdbsfGo77lIKMv5spvwRwCJkC/w1280-h853-k/", "vicinity": "Carrollton, TX, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Vancouver", "address": "Vancouver, BC, Canada", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 49.2827291, "lng": -123.12073750000002, "photo": "https://lh5.googleusercontent.com/-zfCA5EbUBjo/V9mfJ0UXBjI/AAAAAAAAABI/aC3O79bSNfYo1kMa09BPofx7JqAx9ogKwCLIB/w1280-h853-k/", "vicinity": "Vancouver, BC, Canada", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Portland", "address": "Portland, OR, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 45.52306220000001, "lng": -122.67648159999999, "photo": "https://lh3.googleusercontent.com/-lUg98ZeEZ14/WAFtxQkRYAI/AAAAAAAAAro/sfIXLo6c5ZI_LNCZL3Ld6p8M0T1sky88gCLIB/w1280-h853-k/", "vicinity": "Portland, OR, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Las Vegas", "address": "Las Vegas, NV, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 36.1699412, "lng": -115.13982959999998, "photo": "https://lh5.googleusercontent.com/-9GTB7HfLHDU/WAJT4jzTXkI/AAAAAAAAGpw/iF6XexwXQTYJFkjNr3ueCHzXAs0psowkACLIB/w1280-h853-k/", "vicinity": "Las Vegas, NV, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Seattle", "address": "Seattle, WA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 47.6062095, "lng": -122.3320708, "photo": "https://lh3.googleusercontent.com/-xw1La1JMeX4/V-GbZEBfQ3I/AAAAAAAAF1g/iUpAX0VhVKc5TrY4W0IRwhGz07SZYhgTACJkC/w1280-h853-k/", "vicinity": "Seattle, WA, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "San Jose", "address": "San Jose, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 37.3382082, "lng": -121.88632860000001, "photo": "https://lh6.googleusercontent.com/-GzKvECAG9VU/V4qu7pGuQlI/AAAAAAAAD74/r8k589Fvfd4xgp5HTKFiMHahr-UGvW7JACLIB/w1280-h853-k/", "vicinity": "San Jose, CA, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "San Diego", "address": "San Diego, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 32.715738, "lng": -117.16108380000003, "photo": "https://lh3.googleusercontent.com/-zkv0nc3fu0o/V-rjV_h925I/AAAAAAAAiqU/uQW3cvrydaYsaOI8DrYgjbSsHuIoIhNEgCLIB/w1280-h853-k/", "vicinity": "San Diego, CA, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "San Francisco", "address": "San Francisco, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 37.7749295, "lng": -122.41941550000001, "photo": "https://lh3.googleusercontent.com/-cDHTjmaZoj4/WHu_Vc2bbZI/AAAAAAAEAAk/4aBAkScXukM99MXAXzyire-5ibigjuyBACLIB/w1280-h853-k/", "vicinity": "San Francisco, CA, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Los Angeles", "address": "Los Angeles, CA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 34.0522342, "lng": -118.2436849, "photo": "https://lh4.googleusercontent.com/-rUSF0zynIe8/V6Tb98Z3lTI/AAAAAAAABBo/0tSR93lBtJ0aQlvOFOG4akRDBWuA6PT7wCLIB/w1280-h853-k/", "vicinity": "Los Angeles, CA, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "New York", "address": "New York, NY, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 40.7127837, "lng": -74.00594130000002, "photo": "https://lh6.googleusercontent.com/-0Y2LIfXtftk/WAjKQMv5O-I/AAAAAAAATT8/W1xeTYm4R44875Dw6J1qnvKxEbDQsogRgCLIB/w1280-h853-k/", "vicinity": "New York, NY, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Chicago", "address": "Chicago, IL, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 41.8781136, "lng": -87.62979819999998, "photo": "https://lh4.googleusercontent.com/-3Ryvb4IIgKU/V5fn4cN2JwI/AAAAAAAALKQ/Cr99nVXJIXU_jpiexz3Sydy_zrXqKxgTACJkC/w1280-h853-k/", "vicinity": "Chicago, IL, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Dubuque", "address": "Dubuque, IA, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 42.50055830000001, "lng": -90.66457179999998, "photo": "https://lh5.googleusercontent.com/-IUsh3WRaNto/V8PfMopBfUI/AAAAAAAAQ0E/e74hPtt1fbI3NsCfN-ZL4N1Yev77ipBBwCJkC/w1280-h853-k/", "vicinity": "Dubuque, IA, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Dallas", "address": "Dallas, TX, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 32.7766642, "lng": -96.79698789999998, "photo": "https://lh4.googleusercontent.com/-_bZ8zbySbPE/V32qm1XDV6I/AAAAAAAAABY/biS776w0TGkSJRHS--aSnoLkfbxGYN5cwCJkC/w1280-h853-k/", "vicinity": "Dallas, TX, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": true, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Charlotte", "address": "Charlotte, NC, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 35.2270869, "lng": -80.84312669999997, "photo": "https://lh3.googleusercontent.com/--t2zOl0uKq4/V4FUFylQP0I/AAAAAAAAWNY/2K-uFNrODjIAxU-SmmwSl2UHjStxvcvMACJkC/w1280-h853-k/", "vicinity": "Charlotte, NC, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Raleigh", "address": "Raleigh, NC, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 35.7795897, "lng": -78.63817870000003, "photo": "https://lh3.googleusercontent.com/-4oXR7DIxaDU/VYGTGDTmuoI/AAAAAAAAClE/kU4PjgrESiQ0M0Cry1hFGxWSiLZfkgaZwCJkC/w1280-h853-k/", "vicinity": "Raleigh, NC, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Orlando", "address": "Orlando, FL, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 28.5383355, "lng": -81.37923649999999, "photo": "https://lh4.googleusercontent.com/-oRd8NmuxLGM/V2gv8I_J2UI/AAAAAAAAgAs/4Wt6KAWhWxUkBWBcDqsqancigokvvqLpgCLIB/w1280-h853-k/", "vicinity": "Orlando, FL, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Broken Bow", "address": "Broken Bow, OK 74728, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 34.0292764, "lng": -94.7391045, "photo": "https://lh5.googleusercontent.com/-K41YD01KMm4/V4Pwjsb-N-I/AAAAAAAAAHA/AJsMFc8uFiURPndBeFRCjvnycY6OrHQYgCJkC/w1280-h853-k/", "vicinity": "Broken Bow, OK 74728, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Houston", "address": "Houston, TX, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 29.7604267, "lng": -95.3698028, "photo": "https://lh4.googleusercontent.com/-uU4VqBJz_Lg/WAaB-xvoA-I/AAAAAAAAJmY/wZeVx6Zlod0C9OjWIUbd69OvCb1_tztcgCLIB/w1280-h853-k/", "vicinity": "Houston, TX, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Galveston", "address": "Galveston, TX, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 29.3013479, "lng": -94.79769579999999, "photo": "https://lh4.googleusercontent.com/-l-yYs3LPyS4/VuzHSbkjKII/AAAAAAAAFsg/Zll-CxDd5hQ-X9US9CFoRjaGNWF2HrxuwCJkC/w1280-h853-k/", "vicinity": "Galveston, TX, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Negril", "address": "Negril, Jamaica", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 18.2683058, "lng": -78.34724240000003, "photo": "https://lh5.googleusercontent.com/-XFDA4NStw-s/WGnt-DZ9WvI/AAAAAAAAAdE/EFPAGnmBL7kxmFTH7LVERTD09EIZ8IVWQCLIB/w1280-h853-k/", "vicinity": "Negril, Jamaica", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "San Juan", "address": "San Juan, Puerto Rico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0139", "lat": 18.4655394, "lng": -66.10573549999998, "photo": "https://lh6.googleusercontent.com/-R6It4sISCtc/V9V4P8wsEtI/AAAAAAACyDc/dO-zO-JZNNk2efX33GtaZkJ25V6oLaWOQCLIB/w1280-h853-k/", "vicinity": "San Juan, Puerto Rico", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "La Fortuna", "address": "Provincia de Alajuela, La Fortuna, Costa Rica", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2339", "lat": 10.4678335, "lng": -84.6426806, "photo": "https://lh6.googleusercontent.com/-br-B_IceUd0/WAgOQI8A0kI/AAAAAAAAAIs/dd4pEuW4NO46VNW8BNGppxumqX3kUvF6wCLIB/w1280-h853-k/", "vicinity": "Provincia de Alajuela, La Fortuna, Costa Rica", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Cabo San Lucas", "address": "Cabo San Lucas, Baja California Sur, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2239", "lat": 22.8905327, "lng": -109.91673709999998, "photo": "https://lh6.googleusercontent.com/-W7Z3JxLwNPM/V5mUqSfcFDI/AAAAAAAAQps/PvWbIg4obwsUwneNpGaC46LaKOngQtmMwCJkC/w1280-h853-k/", "vicinity": "Cabo San Lucas, Baja California Sur, Mexico", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Cozumel", "address": "Cozumel, Quintana Roo, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 20.4229839, "lng": -86.9223432, "photo": "https://lh6.googleusercontent.com/-BXWW3Gds6s0/WD8oRdeOBOI/AAAAAAAAAEw/SeTxfJVmNGc8bR9JBl1BX8sr2UwX7WKtACLIB/w1280-h853-k/", "vicinity": "Cozumel, Quintana Roo, Mexico", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Playa del Carmen", "address": "Playa del Carmen, Quintana Roo, Mexico", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0039", "lat": 20.6295586, "lng": -87.07388509999998, "photo": "https://lh3.googleusercontent.com/-Xgg4MjTl_X0/V75PWW-aRlI/AAAAAAAATFE/CDh5N5P4izM9N88XzxwdJ-dpjAUOirWwQCJkC/w1280-h853-k/", "vicinity": "Playa del Carmen, Quintana Roo, Mexico", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Soufriere", "address": "Soufriere, Saint Lucia", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0139", "lat": 13.8570986, "lng": -61.0573248, "photo": "https://lh5.googleusercontent.com/-0JLTMzmzpuU/V3QBJi9rXRI/AAAAAAABzsY/yyKppOdAu3EDpviOA2VvV52aptyo5e5DACJkC/w1280-h853-k/", "vicinity": "Soufriere, Saint Lucia", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Carmel-by-the-Sea", "address": "Carmel-By-The-Sea, CA 93923, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2139", "lat": 36.5552386, "lng": -121.92328789999999, "photo": "https://lh5.googleusercontent.com/-J0xo6Qf_ngk/WBbRwiEBxZI/AAAAAAAAFvw/Zy6Cxp0ccuYD4FpgDu8Hgki83tVf5jjkgCLIB/w1280-h853-k/", "vicinity": "Carmel-By-The-Sea, CA 93923, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Giverny", "address": "Giverny, France", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 49.081595, "lng": 1.5335039999999935, "photo": "https://lh3.googleusercontent.com/-dj8P-P_72x0/V8zG4OD2lEI/AAAAAAAAMSU/bbPenuHrnZkkji5Q5vzL25ptghRFzp5ZQCJkC/w1280-h853-k/", "vicinity": "Giverny, France", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Colmar", "address": "Colmar, France", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 48.0793589, "lng": 7.358512000000019, "photo": "https://lh3.googleusercontent.com/-DPRzqtXU6nw/V9j3pvUt_eI/AAAAAAAAF6w/T5u2f0BsI_EDnkIlA6nu4k_pMdoV0VRqwCJkC/w1280-h853-k/", "vicinity": "Colmar, France", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Vail", "address": "Vail, CO 81657, USA", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "2239", "lat": 39.64026379999999, "lng": -106.37419549999998, "photo": "https://lh5.googleusercontent.com/-HXrtzsS4cPg/V3wP-S_-tkI/AAAAAAAARv8/nsalYPOfM9w66x1leE78Z3foq5p6MlFrACJkC/w1280-h853-k/", "vicinity": "Vail, CO 81657, USA", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Reethi Beach Resort Maldives", "address": "Maldives", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1039", "lat": 5.25625, "lng": 73.163725, "photo": "https://lh4.googleusercontent.com/-WHzbP-fl_s4/V0_FKNCY06I/AAAAAAAAAMc/fZ6J5dYGnAwIF1W5w0v8Y7ehJOPQWM4-wCJkC/w1280-h853-k/", "vicinity": "Maldives", "open_hours": [], "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Mo'orea", "address": "Mo'orea, French Polynesia", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1939", "lat": -17.5388435, "lng": -149.82952339999997, "photo": "https://lh5.googleusercontent.com/-mjAA_G32iog/V854eyRaJbI/AAAAAAAAGsY/Pn3HNvTkPRYfmeeRuuR1Efboc9E92i7swCJkC/w1280-h853-k/", "vicinity": "Mo'orea, French Polynesia", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Tahiti", "address": "Tahiti, French Polynesia", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1939", "lat": -17.6509195, "lng": -149.42604210000002, "photo": "https://lh5.googleusercontent.com/-Irr1AdV6FJw/V-2nH4viROI/AAAAAAAAZ4A/71bRNpIT_ykwTsgUSqKj3tYF0PFZ_AdqgCJkC/w1280-h853-k/", "vicinity": "Tahiti, French Polynesia", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Paris", "address": "Paris, France", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 48.85661400000001, "lng": 2.3522219000000177, "photo": "https://lh6.googleusercontent.com/-KiaHd3or_h0/V7Lg8Au0QiI/AAAAAAAANbM/iyGe1ftItT8YNR4j7SyQnGcqZqTTvErRwCJkC/w1280-h853-k/", "vicinity": "Paris, France", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Montserrat", "address": "Montserrat", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0139", "lat": 16.742498, "lng": -62.187366, "photo": "https://lh6.googleusercontent.com/-O9qi7Jt6YAU/WHYgEqhCAII/AAAAAAAALWc/T6sJazz4UBcfgXtvnW6N5BPOeCMo2n2UgCLIB/w1280-h853-k/", "vicinity": "Montserrat", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Barcelona", "address": "Barcelona, Spain", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 41.38506389999999, "lng": 2.1734034999999494, "photo": "https://lh3.googleusercontent.com/-3IHPzd76cdE/WGm39sSXT9I/AAAAAAAAlMg/WUMvGutvcIQZq9FZd7dYzZZsAUNxbPleQCLIB/w1280-h853-k/", "vicinity": "Barcelona, Spain", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Bangkok", "address": "Bangkok, Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1239", "lat": 13.7563309, "lng": 100.50176510000006, "photo": "https://lh6.googleusercontent.com/-Ns68aFL5Z6I/VgrnP6jv3BI/AAAAAAAAABg/8A1JyduGpsUdLjVlO6LbkL5oETdjhlJpACJkC/w1280-h853-k/", "vicinity": "Bangkok, Thailand", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Phuket", "address": "Phuket, Thailand", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1239", "lat": 7.9519331, "lng": 98.33808840000006, "photo": "https://lh5.googleusercontent.com/-Lp_zHpVD93s/WHU1WD28lPI/AAAAAAAAGYM/cB9pA0F9T60L-oCzT7uXelOhYhZ031plQCLIB/w1280-h853-k/", "vicinity": "Phuket, Thailand", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Rome", "address": "Rome, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 41.90278349999999, "lng": 12.496365500000024, "photo": "https://lh3.googleusercontent.com/-lCvdrx6Xp1M/WEmtVbO5niI/AAAAAAAA5i0/CFKzD8El5iMNSmJ-mRJNdSqxXJtkxtkhACLIB/w1280-h853-k/", "vicinity": "Rome, Italy", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Sorrento", "address": "80067 Sorrento, Metropolitan City of Naples, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 40.6262925, "lng": 14.375798499999974, "photo": "https://lh5.googleusercontent.com/-8wi4cGZ1G3I/V6PGph2BcoI/AAAAAAAAAfk/Qe5XHOstNq4pz4tFEAhi90q77pG9UGTHwCJkC/w1280-h853-k/", "vicinity": "80067 Sorrento, Metropolitan City of Naples, Italy", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Capri", "address": "Capri, Metropolitan City of Naples, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 40.5532009, "lng": 14.222154000000046, "photo": "https://lh4.googleusercontent.com/-_xtbBA6g9f4/V9E2B0GIqdI/AAAAAAACu8s/aM2ZJnZwqm0oF51lW0RoiaTNOCzqUbMTACLIB/w1280-h853-k/", "vicinity": "Capri, Metropolitan City of Naples, Italy", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Florence", "address": "Florence, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 43.7695604, "lng": 11.25581360000001, "photo": "https://lh4.googleusercontent.com/-WQ7rp6rN8-Q/WGoJNb-L-5I/AAAAAAAAaBY/2SF7_k-291Y4r2ZW44vYItsVJjdKsZbfQCLIB/w1280-h853-k/", "vicinity": "Florence, Italy", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Venice", "address": "Venice, Italy", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "0639", "lat": 45.4408474, "lng": 12.31551509999997, "photo": "https://lh6.googleusercontent.com/-9o-3Hj9aZdg/VX2MnAucIVI/AAAAAAABO90/MWKwGsKuzvc7MTRh6JQNi8jucfTQXmejwCJkC/w1280-h853-k/", "vicinity": "Venice, Italy", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Tokyo", "address": "Tokyo, Japan", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1439", "lat": 35.6894875, "lng": 139.69170639999993, "photo": "https://lh4.googleusercontent.com/-2eeAVNdKaeU/WIrMCevwiHI/AAAAAAAAibk/npKgSVHEydQtNBbn7JdlHxptQMR77_vnQCLIB/w1280-h853-k/", "vicinity": "Tokyo, Japan", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }, { "title": "Kyoto", "address": "Kyoto, Kyoto Prefecture, Japan", "desc": "", "tel": "", "int_tel": "", "email": "", "web": "", "web_formatted": "", "open": "", "time": "1439", "lat": 35.01163629999999, "lng": 135.76802939999993, "photo": "https://lh3.googleusercontent.com/-84OnrLJvQ_s/V6893qAb1gI/AAAAAAAAYVk/yIflSLPVmEEeU-XW_St3LCyFqUunX2ukACLIB/w1280-h853-k/", "vicinity": "Kyoto, Kyoto Prefecture, Japan", "open_hours": "", "marker": { "url": "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi_hdpi.png", "scaledSize": { "width": 25, "height": 42, "j": "px", "f": "px" }, "origin": { "x": 0, "y": 0 }, "anchor": { "x": 12, "y": 42 } }, "iw": { "address": true, "desc": false, "email": false, "enable": true, "int_tel": false, "open": true, "open_hours": true, "photo": true, "tel": false, "title": false, "web": false } }
    ]
}
