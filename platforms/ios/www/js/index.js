var API_KEY = '1403d835-a9aa-4d50-8757-b590f364b90b';

var API_URL = 'https://api.mpsa.com/api/dev';


var a = angular.module('my-app', ['onsen', 'ngResource', 'uiGmapgoogle-maps', 'ngSanitize'/*, 'ngAnimate'*/]);

a.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
			// enregistrer un couple clé / valeur
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
			// récupérer la valeur d'uen clé
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
			// enregistrer un objet pour la clé 
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
			// récupérer l'object stocké dans la clé
            return JSON.parse($window.localStorage[key] || '{}');
        }
    };
}]);

a.controller('initController' ,function($scope,$localstorage,$http,$log)
{
	// on détecte la fin de l'initialisation de l'application
    ons.ready(function()
    {
		
		// l'objet pref qui stockera les préférence de l'utilisateur
		// Cet objet est détruit lorsque l'on sort de l'application
		// pour enregistrer les valeurs des préférences de l'utilisateur
		// il faut utiliser la factory $localstorage
        $scope.pref = [];
       
		// On intialise le VIN pour le créer
		$scope.pref.vin = '';
		
		// le contrat ...
        $scope.pref.contrat = '';

		// le code secure ...
        $scope.pref.code_secure = '';
        
        $scope.datal= [];
		// et le switch.
		$scope.pref.save_vin_switch = false;
        
        $scope.datas = [];
        $scope.datae = [];
        $scope.pref.login = '';
        $scope.pref.pwd = '';
        $scope.pref.prenom = '';
        $scope.pref.nom = '';
        $scope.pref.key = '';
        $scope.pref.forfait = '';
        $scope.pref.fuelevel = 0;
        $scope.datas.carsid = '';
        $scope.datas.codepos = '';
        $scope.datas.complement = '';
        $scope.datas.id = '';
        $scope.datas.locid = '';
        $scope.datas.nom = '';
        $scope.datas.num = '';
        $scope.datas.ville = '';
         $scope.datae.carsid = '';
        $scope.datae.codepos = '';
        $scope.datae.complement = '';
        $scope.datae.id = '';
        $scope.datae.locid = '';
        $scope.datae.nom = '';
        $scope.datae.num = '';
        $scope.datae.ville = '';
		// si on a déjà des préférences enregistrées dans le mobile
        if ( $localstorage.get('pwd') !== undefined ) {
			// on les charge
            $scope.pref.vin = $localstorage.get('pwd');
        }

        if ( $localstorage.get('login') !== undefined ) {
            $scope.pref.contrat = $localstorage.get('login');
        }
    });
});

a.factory('infocar', function($resource) {
    var infocar = function(vin,contrat){
        this.vin = vin;
        this.contrat = contrat;
        this.info = null;
    }
    infocar.prototype.get_info = function()
    {
        var self = this;
        return $resource(API_URL +'/1.0/vehicle/information/'+this.vin+'?contract='+this.contrat+'&client_id=' + API_KEY).get().$promise.then(function(response){
            self.info = response;
            return response
        }, function(error){
			// une gestion simpliste des erreurs :
			ons.notification.alert({
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
			});
		});
    }
    return infocar;
});


a.factory('alert', function($resource) {
    
    var alert = function(vin, contrat, brand)
    {
        this.vin = vin;
        this.contrat = contrat;
        this.brand = brand;
        this.alert = null;
    };
    alert.prototype.get_alert = function(){
        var self = this;
        return $resource(API_URL +'/1.0/maintenance/list/alert?locale=fr_FR&brand=C&active=0&client_id='+ API_KEY, {charge: {method: 'POST', params: {
            "listvin": this.vin,"listcontract": this.contrat
        }}}).save().$promise.then( function(response)
        {
            self.alert = response;
            return response;
        }
    , function(error) {
			// une gestion simpliste des erreurs :)
			ons.notification.alert({
				message: "Une erreur de geocalisation s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
            });
        });
    };
    return alert;
});

a.factory('maintenance', function($resource){
    var maintenance = function(vin, contract){
        this.vin = vin;
        this.contract = contract;
        this.results = null;
    };
    maintenance.prototype.get_info_car = function() {
        var self = this;
        return $resource(API_URL +'/1.0/maintenance/'+this.vin+'?contract='+this.contract+'&client_id=' + API_KEY).get().$promise.then( function(response) {
            self.results = {'m': response};
            return response;
    }, function(error) {
			// une gestion simpliste des erreurs :
			ons.notification.alert({
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
			});
		});
    }
    return maintenance;
});

a.factory('Car', function($resource){

	// Le constrcteur de l'objet
	var Car = function(vin,contrat){
		this.vin = vin;
		this.contrat = contrat;
		
		// pour l'instant on ne sait pas ou se trouve le véhicule
		this.position = null;
	};

	// Récupération de la position du véhicule
	Car.prototype.get_location = function(){

		// En général, les callbacks javascript , comme par exemple le 
		// callback $ressource.get, modifie la valeur de la variable "this" 
        // on doit donc garder une référence du "this" courant
		var self = this;
		
		// on utilise les $resource pour faire appel aux APIs.
		// on interroge l'API pour un éch1403d835-a9aa-4d50-8757-b590f364b90bantillonage toutes les 6 secondes.
		return $resource(API_URL + '/1.0/place/lastposition/' + this.vin + '?near=1&contract=' + this.contrat + '&listsecond=6,12,18,24,30,36,42,48,54,60&client_id=' + API_KEY).get().$promise.then( function(response) {

			// on va rechercher la derniere position utilisable de la minute.
			// une table de hash n'est pas forcément triée par clée. 
			var lats = response.latitude;

			keys = [];
			
			for (k in lats){
				if (lats.hasOwnProperty(k)){
					keys.push(k);
				}	
			}

			keys.sort();

			len = keys.length;
			i = 0;
			for (i = len-1; i > 0; i--) {
				if (lats[k] != null) {
					// on a trouvé une latitude correcte.
					break;
				}
			}
			
            self.position = {
				'latitude': response.latitude[keys[i]],
				'longitude' : response.longitude[keys[i]]
			};
            console.log(self.position);
						
            // Les promises doivent toujours renvoyer quelque chose
            return response;
		}, function(error) {
			// une gestion simpliste des erreurs :)
			ons.notification.alert({
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
			});
		});
	};
	
	return Car;
});

a.factory('NameAdresse', function($resource) {
    var NameAdresse = function(locs, loc){
        console.log(locs);
        console.log(loc);
        if (locs)
            this.locs = locs;
        if (loc && (loc.latitude != 0. && loc.longitude != 0.))
            this.loc = loc;
        else {
            this.loc = {
                'latitude': 48.845494,
                'longitude': 2.371255
            } 
        }
        this.addlocs = null;
        this.addloc = null;
    }
    NameAdresse.prototype.get_name_sitter = function() {
        var self = this;
        return $resource('http://maps.googleapis.com/maps/api/geocode/json?latlng='+this.locs.latitude+','+this.locs.longitude+'&sensor=true').get().$promise.then( function(response) {
            self.addlocs = {
                'add': response.results[0].formatted_address
            };
            return response;
        }, function(error) {
			// une gestion simpliste des erreurs :
			ons.notification.alert({
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
			});
		});

			
    }
     NameAdresse.prototype.get_name_car = function() {
        var self = this;
        return $resource('http://maps.googleapis.com/maps/api/geocode/json?latlng='+this.loc.latitude+','+this.loc.longitude+'&sensor=true').get().$promise.then( function(response) {
            self.addloc = {
                'add': response.results[0].formatted_address
            };
            return response;
        }, function(error) {
			// une gestion simpliste des erreurs :
			ons.notification.alert({
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
			});
		});

			
    }
    return NameAdresse;
});

a.factory('Carsit' , function($resource) {
   var Carsit = function(id){
       this.id = id;
       this.position = null;
   };
        Carsit.prototype.get_mylocation = function() {
            var self = this;
            
            return $resource('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBbLtm02HUgPoGQPws5ljkOR6BKReROqpY', { charge: { method: 'POST', params: {  "macAddress": " a4:5d:36:69:91:85",
  "signalStrength": -43,
  "age": 0,
  "channel": 11,
  "signalToNoiseRatio": 0} }}).save().$promise.then( function(response)
            {
            self.position = {
				'latitude': response.location.lat,
				'longitude' : response.location.lng
			};
						
            // Les promises doivent toujours renvoyer quelque chose
            return response;
		}, function(error) {
			// une gestion simpliste des erreurs :)
			ons.notification.alert({
				message: "Une erreur de geocalisation s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
            });
        });
   }; 
    return Carsit;
});

a.factory('mile', function($resource)
{
    var mile = function (start, today, vin, contrat)
    {
        console.log(start);
        console.log(today);
        this.vin = vin;
        this.contrat = contrat;
        this.today = today;
        this.start = start;
        this.result = 0;
    };
    mile.prototype.get_mile_tot = function()
    {
        var self = this;
        return $resource(API_URL + '/1.0/trip/period/monvin?contract='+this.contrat+'&from='+this.start+'&to='+this.today+'&limit=10&unit=1&client_id=' + API_KEY).get().$promise.then( function(response) {
            
            var i = 0;
            var km = 0;
            while(response.trips[++i])
            {
                km += response.trips[i].tripMileage;
            }
            self.result = km;
            return response;
    }, function(error) {
			// une gestion simpliste des erreurs :
			ons.notification.alert({
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {
					// Alert button is closed!
				}
			});
		});
    }
    return mile;
});

a.controller('sqlController', function($scope,$http, $q){
   $scope.log = function($login, $mdp){
       var request = $http({
           method: "post",
    url: "js/log.php",
    data: {
        email: $login,
        pass: $mdp
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

/* Check whether the HTTP Request is successful or not. */
request.success(function (data) {
    if (data == 'null')
    {
        document.getElementById("message").textContent = "Invalid login or password";
    }
    else
    {
        $scope.pref.login = data[0].login;
        $scope.pref.nom = data[0].nom;
        $scope.pref.prenom = data[0].prenom;
        $scope.pref.key = data[0].id;
        $scope.pref.vin = "monvin";
        $scope.pref.contrat = "moncontrat";
        $scope.pref.forfait = data[0].forfait;
        document.querySelector('#navigator').pushPage('home.html');
    }
});
   };
});

a.controller('homeController', function($scope,$http,maintenance,alert,infocar,$filter, mile){
     ons.ready(function(){
         /*var maint = new maintenance($scope.pref.vin,$scope.pref.contrat);
        maint.get_info_car().then(function(){
         $scope.totmile = maint.results.m.maintenance.totMileage;
         $scope.pref.fuelevel = maint.results.m.fuel.fuelLevel
         });*/
         
         var req = $http({
           method: "post",
    url: "js/loc.php",
    data: {
        key: $scope.pref.key
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});
    req.success(function (data) {
    if (data == 'null')
    {
        console.log('errror');
    }
    else
    {
       console.log(data);
        $scope.datal.end = data.enddate;
        $scope.datal.start = data.startdate;
        $scope.datal.idcarsiend = data.idcarsiend;
        $scope.datal.idcarsistart = data.idcarsistart;
        $scope.datas.carsid = data.start.carsid;
        $scope.datas.codepos = data.start.codepos;
        $scope.datas.complement = data.start.complement;
        $scope.datas.id = data.start.id;
        $scope.datas.locid = data.start.locid;
        $scope.datas.nom = data.start.nom;
        $scope.datas.num = data.start.num;
        $scope.datas.ville = data.start.ville;
        $scope.datae.carsid = data.end.carsid;
        $scope.datae.codepos = data.end.codepos;
        $scope.datae.complement = data.end.complement;
        $scope.datae.id = data.end.id;
        $scope.datae.locid = data.end.locid;
        $scope.datae.nom = data.end.nom;
        $scope.datae.num = data.end.num;
        $scope.datae.ville = data.end.ville;
    }
          var date = new Date();
        var today = $filter('date')(new Date(), 'yyyyMMdd');
        var start = $filter('date')(new Date($scope.datal.start), 'yyyyMMdd');
         
          var totmile = new mile(start, today, $scope.pref.vin, $scope.pref.contrat);
            totmile.get_mile_tot().then(function()
            {
                $scope.tripmile = totmile.result;
                console.log(totmile.result);
                
            });
        
        });
         
     });
    $scope.charto = function(){
         var maint = new maintenance($scope.pref.vin,$scope.pref.contrat);
        maint.get_info_car().then(function(){
         var chart = c3.generate({bindto: '#chart', data:
            {
                        columns: [['essence', 0]], type: 'gauge'
            },
            gauge:
            {
    //              label:S
       //             {
    //                  format: function(value, ratio)
                      //  {
    //                      return value;
    //                  },
    //                  show: false // to turn off the min/max labels.
    //          },
                min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
                max: 100, // 100 is default
    //          units: ' %',
    //          width: 39 // for adjusting arc thickness
                       },
                color:
                {
                    pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
                    threshold:
                    {
                //      unit: 'value', // percentage is default
                //      max: 200, // 100 is default
                        values: [15, 35, 60, 100]
                    }
                },
                size:
                {
                    height: 180
                }
            });
                                                 
           /* for (var i = 0; i < originList.length; i++)*/
            /*document.getElementById("chart").style.display = "block";*/
            setTimeout(function ()
            {
                chart.load(
                {
                    columns: [['essence', maint.results.m.fuel.fuelLevel]]
                });
            }, 1000);
            $scope.totmile = maint.results.m.maintenance.totMileage;
        });
        var inf = new infocar($scope.pref.vin,$scope.pref.contrat);
        inf.get_info().then(function()
        {
            var al = new alert($scope.pref.vin,$scope.pref.contrat,inf.info.brand);
            al.get_alert().then(function()
            {   
                var i = 1;
                var table = document.getElementById("alert");
                var row;
                while(al.alert.listAlert[i - 1])
                {
                    if (al.alert.listAlert[i - 1].dateAlertBegin && al.alert.listAlert[i - 1].alert)
                    {
                        document.getElementById("alert").style.visibility = "visible";
                        row = table.insertRow(i);
                        row.insertCell(0).innerHTML = al.alert.listAlert[i - 1].dateAlertBegin;
                        row.insertCell(1).innerHTML = al.alert.listAlert[i - 1].alert;
                    }
                    i++;
                }   
            });
        });
        var date = new Date();
        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        console.log($scope.date);
        $scope.msg = 'jojo';
        $scope.at = '';
        if ($scope.date < $scope.datal.start && $scope.date < $scope.datal.end)
        {
            $scope.msg = "Your rental starts on";
            $scope.date = $scope.datal.start;
            $scope.at = ' at '+ $scope.datas.num+' '+$scope.datas.nom+' '+' in '+$scope.datas.ville;
        }
        else if ($scope.date > $scope.datal.start && $scope.date < $scope.datal.end)
        {
            
            $scope.msg = "Your rental ends on";
            $scope.date = $scope.datal.end;
            $scope.at = " at "+ $scope.datae.num+" "+$scope.datae.nom+" "+" in "+$scope.datae.ville;        
        }
        else if ($scope.date > $scope.datal.start && $scope.date > $scope.datal.end)
        {
            $scope.msg = "Your rental is finish";
            $scope.date = '';
            $scope.at = '';
            
        }
       /* else
        {
            $scope.msg = "error";
        }*/
        if ($scope.date  > $scope.datal.start)
        {
                if ($scope.triptmile > $scope.pref.forfait)
                {
                    $scope.you = "You have exceeded your package";
                    $scope.howmuch = $scope.triptmile - $scope.pref.forfait;
                }
                if ($scope.triptmile < $scope.pref.forfait)
                {
                    $scope.you = "You have";
                    $scope.howmuch = $scope.pref.forfait - $scope.tripmile;
                    $scope.have = "km left on your package";
                }
        }
    }
});




window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};
