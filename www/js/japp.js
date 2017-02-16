var API_KEY = '1403d835-a9aa-4d50-8757-b590f364b90b';

var API_URL = 'https://api.mpsa.com/api/dev';


var a = angular.module('my-app', ['onsen', 'ngResource', 'uiGmapgoogle-maps', 'ngSanitize', 'ngCordova'/*, 'ngAnimate'*/]);

a.factory('$localstorage', ['$window', function($window)
{
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
	$scope.carsi = [];
	$scope.carsi.name = "";
	$scope.carsi.num = "";
        $scope.pref.login = '';
        $scope.pref.pwd = '';
        $scope.pref.prenom = '';
        $scope.pref.nom = '';
        $scope.pref.key = '';
        $scope.pref.forfait = '';
        $scope.pref.forfai = '';
        $scope.pref.forfaitmsg = "";
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
        $scope.pref.fuelstart = '';
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

a.factory('infocar', function($resource)
{
    var infocar = function(vin,contrat)
    {
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
        },function(error)
        {
            ons.notification.alert(
            {
                message: "Une erreur s'est produite. Merci de réessayer plus tard.",
                title: 'Erreur',
                buttonLabel: 'OK',
                animation: 'default', // or 'none'
                callback: function() {}
			});
		});
    }
    return infocar;
});


a.factory('alert', function($resource)
{
    
    var alert = function(vin, contrat, brand)
    {
        this.vin = vin;
        this.contrat = contrat;
        this.brand = brand;
        this.alert = null;
    };
    alert.prototype.get_alert = function()
    {
            var self = this;
            return $resource(API_URL +'/1.0/maintenance/list/alert?locale=fr_FR&brand=C&active=0&client_id='+ API_KEY, {charge: {method: 'POST', params: {
                "listvin": this.vin,"listcontract": this.contrat
            }}}).save().$promise.then( function(response)
            {
                self.alert = response;
                return response;
            }
        , function(error)
        {
            ons.notification.alert(
            { 
                message: "Une erreur de geocalisation s'est produite. Merci de réessayer plus tard.",
                title: 'Erreur',
                buttonLabel: 'OK',
                animation: 'default', // or 'none'
                callback: function() {}
            });
        });
    };
    return alert;
});

a.factory('maintenance', function($resource)
{
    var maintenance = function(vin, contract)
    {
        this.vin = vin;
        this.contract = contract;
        this.results = null;
    };
    maintenance.prototype.get_info_car = function()
    {
            var self = this;
            return $resource(API_URL +'/1.0/maintenance/'+this.vin+'?contract='+this.contract+'&client_id=' + API_KEY).get().$promise.then( function(response) {
                self.results = {'m': response};
                return response;
        }, function(error)
        {
            ons.notification.alert(
            {
                message: "Une erreur s'est produite. Merci de réessayer plus tard.",
                title: 'Erreur',
                buttonLabel: 'OK',
                animation: 'default', // or 'none'
                callback: function() {}
            });
	   });
    }
    return maintenance;
});

a.factory('Car', function($resource)
{
	var Car = function(vin,contrat)
    {
		this.vin = vin;
		this.contrat = contrat;
		this.position = null;
	};

	Car.prototype.get_location = function()
    {

		
		var self = this;
		return $resource(API_URL + '/1.0/place/lastposition/' + this.vin + '?near=1&contract=' + this.contrat + '&listsecond=6,12,18,24,30,36,42,48,54,60&client_id=' + API_KEY).get().$promise.then( function(response)
        {
			var lats = response.latitude;
			keys = [];
			for (k in lats)
            {
				if (lats.hasOwnProperty(k))
                {
					keys.push(k);
				}	
			}
			keys.sort();
			len = keys.length;
			i = 0;
			for (i = len-1; i > 0; i--)
            {
				if (lats[k] != null)
                {
					break;
				}
			}
			
            self.position =
            {
				'latitude': response.latitude[keys[i]],
				'longitude' : response.longitude[keys[i]]
			};
            return response;
		}, function(error)
        {
			ons.notification.alert(
            {
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function(){}
			});
		});
	};	
	return Car;
});

a.factory('NameAdresse', function($resource)
{
    var NameAdresse = function(locs, loc)
    {
        if (locs)
            this.locs = locs;
        if (loc && (loc.latitude != 0. && loc.longitude != 0.))
            this.loc = loc;
        else
        {
            this.loc = 
            {
                'latitude': 48.845494,
                'longitude': 2.371255
            } 
        }
        this.addlocs = null;
        this.addloc = null;
    }
    NameAdresse.prototype.get_name_sitter = function()
    {
        var self = this;
        return $resource('http://maps.googleapis.com/maps/api/geocode/json?latlng='+this.locs.latitude+','+this.locs.longitude+'&sensor=true').get().$promise.then( function(response) {
        self.addlocs =
        {
            'add': response.results[0].formatted_address
        };
        return response;
        }, function(error)
        {
			ons.notification.alert(
            {
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {}
            });
        });
    }
    NameAdresse.prototype.get_name_car = function()
    {
        var self = this;
        return $resource('http://maps.googleapis.com/maps/api/geocode/json?latlng='+this.loc.latitude+','+this.loc.longitude+'&sensor=true').get().$promise.then( function(response) {
        self.addloc =
        {
                'add': response.results[0].formatted_address
        };
        return response;
        }, function(error)
        {
			ons.notification.alert(
            {
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {}
			});
		});
    }
    return NameAdresse;
});

a.factory('Carsit' , function($resource)
{
    var Carsit = function(id)
    {
        this.id = id;
        this.position = null;
    };
    Carsit.prototype.get_mylocation = function() 
    {
        var self = this;
        return $resource('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBbLtm02HUgPoGQPws5ljkOR6BKReROqpY', { charge: { method: 'POST', params: {  "macAddress": " a4:5d:36:69:91:85",
  "signalStrength": -43,
  "age": 0,
  "channel": 11,
  "signalToNoiseRatio": 0} }}).save().$promise.then( function(response)
        {
            self.position =
            {
				'latitude': response.location.lat,
				'longitude' : response.location.lng
			};
            return response;
		}, function(error)
        {
			ons.notification.alert(
            {
				message: "Une erreur de geocalisation s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {}
            });
        });
   }; 
    return Carsit;
});

a.factory('crash', function($resource)
{
	var crash = function (start, end, vin, contrat)
	{
		this.start = start;
		this.end = end;
		this.vin = vin;
		this.contrat = contrat;
		this.res = null;
	};
	crash.prototype.info_crash = function()
	{
		var self = this;
		return $resource(API_URL + '/1.0/crash/get/'+ this.vin +'?contract='+ this.contrat+'&listsecond=6,12,18,24,30,36,42,48,54,60&client_id=' + API_KEY).get().$promise.then( function(response) {
            self.res = response;
		return response;
        }, function(error)
        {
            ons.notification.alert(
            {
                message: "Une erreur s'est produite.",
                title: 'Erreur',
                buttonLabel: 'OK',
                animation: 'default', // or 'none'
                callback: function() {}
            });
        });
    }
	return crash;
});

a.factory('mile', function($resource)
{
    var mile = function (start, today, vin, contrat)
    {
        this.vin = vin;
        this.contrat = contrat;
        this.today = today;
        this.start = start;
        this.result = 0;
    };
    mile.prototype.get_mile_tot = function()
    {
        var self = this;
        return $resource(API_URL + '/1.0/trip/period/'+ this.vin +'?contract='+this.contrat+'&from='+this.start+'&to='+this.today+'&limit=10&unit=1&client_id=' + API_KEY).get().$promise.then( function(response) {
            
            var i = 0;
            var km = 0;
            if (response.code == "1")
            {
                    ons.notification.alert(
                    {
                        message: "Une erreur s'est produite. Merci de réessayer plus tard.",
                        title: 'Erreur',
                        buttonLabel: 'OK',
                        animation: 'default', // or 'none'
                        callback: function() {}
                    });
            }
            else
            {
                while(response.trips[++i])
                {
                    km += response.trips[i].tripMileage;
                }
            }
            self.result = km;
            return response;
    }, function(error) {
			ons.notification.alert(
            {
				message: "Une erreur s'est produite. Merci de réessayer plus tard.",
				title: 'Erreur',
				buttonLabel: 'OK',
				animation: 'default', // or 'none'
				callback: function() {}
			});
		});
    }
    return mile;
});

a.controller('sqlController', function($scope,$http, $q)
{
   $scope.log = function($login, $mdp)
   {
	$scope.pref.v = 0;
        var request = $http(
        {
            method: "post",
            url: "js/login.php",
            data: {
                email: $login,
                pass: $mdp
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

/* Check whether the HTTP Request is successful or not. */
        request.success(function (data)
        {
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
                document.querySelector('#navigator').pushPage('home.html');
            }
        });
    };
});

a.controller('homeController', function($timeout,$scope,$http,maintenance,alert,infocar,$filter, mile,Car,Carsit,NameAdresse,crash)
{
    ons.ready(function()
    {
        var req = $http(
        {
           method: "post",
           url: "js/loc.php",
           data: {
                key: $scope.pref.key
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        req.success(function (data)
        {
            this.v = 20;
            if (data == 'null')
            {
                console.log('errror');
            }
            else
            {
                $scope.pref.v = 0;
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
                $scope.pref.contrat = data.car.contrat;
                $scope.pref.vin = data.car.vin;
                $scope.pref.fuelstart = data.car.fuellevel;
                $scope.pref.forfai = data.forfait;
            }
            var date = new Date();
            setTimeout(function ()
            {
                var today = $filter('date')(new Date(), 'yyyyMMdd');
                var start = $filter('date')(new Date($scope.datal.start), 'yyyyMMdd');
                var tod = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                $scope.pref.v = ($scope.pref.v + 20) % 102;
                var totmile = new mile(start, today, $scope.pref.vin, $scope.pref.contrat);
                totmile.get_mile_tot().then(function()
                {
                    $scope.tripmile = totmile.result;
                    if (tod  > $scope.datal.start && tod < $scope.datal.end)
                    {
                    	if ($scope.tripmile > $scope.pref.forfai)
                    	{
                            $scope.ex = 1;
                    	    $scope.you = "You have exceeded your package";
                    	    $scope.howmuch = Math.floor($scope.tripmile) - Math.floor($scope.pref.forfai);
				$scope.warning = 'You have exceeded your package of ' + $scope.howmuch + ' KM';
            			document.getElementById("warn").style.visibility = "visible";
            			document.getElementById("warn").style.display = "block";
                            $scope.have = '';
                    	}
                    	else if ($scope.tripmile < $scope.pref.forfai)
                    	{
                            $scope.ex = 2;	
                            $scope.you = "You have";
                            $scope.howmuch = Math.floor($scope.pref.forfai) - Math.floor($scope.tripmile);
				if ($scope.howmuch < 20)
				{
					$scope.warning = 'Kilometers left on my package : '+ $scope.howmuch;
            				document.getElementById("warn").style.visibility = "visible";
            				document.getElementById("warn").style.display = "block";
                     	  	}
				$scope.have = "km left on your package";
                    	}
                    }
                    else if (tod < $scope.datal.start && tod < $scope.datal.end)
                    {
                        $scope.ex = 0;
                        $scope.pref.forfait = $scope.pref.forfai;
                        $scope.pref.forfaitmsg = "Km on your package";
                    }
                });
            	if (tod > $scope.datal.start && tod < $scope.datal.end)
            	{
                	var crsh = new crash($filter('date')(new Date($scope.datal.start), 'yyyyMMddHHmmss'), $filter('date')(new Date(), 'yyyyMMddHHmmss'), $scope.pref.vin, $scope.pref.contrat);
                	crsh.info_crash().then(function()
                    {
                        if (crsh.res != null)
                        {
                            var inf_safe = $http(
                            {
                   				method: "post",
            					url: "js/safe.php",
            					data: {
                					key: crsh.res
            					},
            					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            });
            				inf_safe.success(function (data)
                            {
            			});
            		} 
                	});
            	}
            }, 1000);
                
    });
});

    $scope.charto = function($done)
	{
		//$timeout(function(){
		$scope.pref.v = 0;
		setTimeout(function()
		{
        		 var maint = new maintenance($scope.pref.vin,$scope.pref.contrat);
        		maint.get_info_car().then(function(){

var chart = c3.generate(
			{
				bindto: '#chart', data:
            			{
                        		columns: [['essence', 0]], type: 'gauge',labels: true
            			},axis: {
        y: {
            max: 100,
            min: 0,
            padding: { top: 0, bottom: 0 }
        }
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
                   			 height: 107
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
            $scope.fuelmoy = maint.results.m.fuel.instFuelConsumption60 / 10000;
        });
	
        $scope.pref.v = ($scope.pref.v + 20) % 102;
        var inf = new infocar($scope.pref.vin,$scope.pref.contrat);
        inf.get_info().then(function()
        {
            var al = new alert($scope.pref.vin,$scope.pref.contrat,inf.info.brand);
            al.get_alert().then(function()
            {   
                var i = 1;
            	setTimeout(function ()
            	{
            		//if (document.getElementById("alert") != null)
            		//{
                   	 	//var table = document.getElementById("alert");
                    	//var row;
                   		while(al.alert.listAlert[i - 1])
                    	{
                        	if (al.alert.listAlert[i - 1].dateAlertBegin && al.alert.listAlert[i - 1].alert)
                        	{
            				    //document.getElementById("alert").style.visibility = "visible";
                                //row = table.insertRow(i);
				//row.insertCell(0).innerHTML = '';
				//row.insertCell(1).innerHTML = '';
                                //row.insertCell(0).innerHTML = al.alert.listAlert[i - 1].dateAlertBegin;
                                //row.insertCell(1).innerHTML = al.alert.listAlert[i - 1].alert;
                        	$scope.items = [{name: al.alert.listAlert[i - 1].alert}];
				}
                        	i++;
                    	}
                        i = 1;
			//}
            	}, 1000);
            });
        });
        $scope.pref.v = ($scope.pref.v + 20) % 102;
        var date = new Date();
        $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        $scope.msg = '';
        $scope.at = '';
        setTimeout(function ()
        {
            if ($scope.date < $scope.datal.start && $scope.date < $scope.datal.end)
            {
		
		document.getElementById('rif').style.visibility = "hidden";	
		document.getElementById('rif').style.display = "none";	
		$scope.pref.statrent = "Start of my trip";
                $scope.msg = "Your rental starts on";
                $scope.datemsg = $filter('date')(new Date($scope.datal.start), 'fullDate');
		$scope.timemsg = $filter('date')(new Date($scope.datal.start), 'shortTime');
                $scope.at = ' at '+ $scope.datas.num+' '+$scope.datas.nom;
		$scope.city = 'In ' + $scope.datas.ville;
		
		var date1 = $filter('date')(new Date($scope.datal.start), 'yyyyMMdd');
		var date2 = $filter('date')(new Date(), 'yyyyMMdd');
		//if (date1 === date2)
		//{
			//var time1 = $filter('date')(new Date($scope.datal.start), 'HHmm');
			//var time2 = $filter('date')(new Date(), 'HHmm');
			//var tmp = time1 - time2;
			//tmp = Math.floor(tmp / 60);
			//tmp = tmp % 24;
			//if (tmp <= 1 && tmp >= 0)
			//{
				var reqsitter = $http(
				{
					method: "post",
					url: "js/carsitter.php",
					data: {
						key: $scope.datal.idcarsistart
					},
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});
				reqsitter.success(function (data)
        			{
					if (data == 'null')
						console.log('error carsiter');
					else
					{
						document.getElementById('carsi').style.visibility = "visible";	
						$scope.carsi.name = data.carsitter.name;
						$scope.carsi.num = '0' + data.carsitter.tel;
					}
				});
			//}
		//}
            }
            else if ($scope.date > $scope.datal.start && $scope.date < $scope.datal.end)
            {
                
                $scope.pref.statrent = "End of my trip";
                $scope.msg = "Your rental ends on";
                $scope.datemsg = $filter('date')(new Date($scope.datal.end), 'fullDate');
		$scope.timemsg = $filter('date')(new Date($scope.datal.end), 'shortTime');
		$scope.at = " at "+ $scope.datae.num+" "+$scope.datae.nom;
		$scope.city = "In "+$scope.datae.ville;
		
		var date1 = $filter('date')(new Date($scope.datal.end), 'yyyyMMdd');
		var date2 = $filter('date')(new Date(), 'yyyyMMdd');
		//if (date1 === date2)
		//{
			//var time1 = $filter('date')(new Date($scope.datal.end), 'HHmm');
			//var time2 = $filter('date')(new Date(), 'HHmm');
			//console.log(time1);
			//console.log(time2);
			//var tmp = time1 - time2;
			//tmp = Math.floor(tmp / 60);
			//tmp = tmp % 24;
			//console.log(tmp);
			//if (tmp <= 1 && tmp >= 0)
			//{
				var reqsitter = $http(
				{
					method: "post",
					url: "js/carsitter.php",
					data: {
						key: $scope.datal.idcarsiend
					},
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				});
				reqsitter.success(function (data)
        			{
					if (data == 'null')
					{
						$scope.carsi.name = "Your Carsitter will";
						$scope.carsi.num = "Soon be selected"
					}
					else
					{
						document.getElementById('carsi').style.visibility = "visible";	
						$scope.carsi.name = data.carsitter.name;
						$scope.carsi.num = '0' + data.carsitter.tel;
					}
				});
			//}
	
		//}
		$scope.pref.v = 100;
            }
            else if ($scope.date > $scope.datal.start && $scope.date > $scope.datal.end)
            {
		document.getElementById('carsi').style.visibility = "collapse";	
		document.getElementById('tof').style.visibility = "collapse";	
		document.getElementById('call').style.visibility = "collapse";	
		document.getElementById('calli').style.visibility = "collapse";	
		document.getElementById('rif').style.visibility = "collapse";	
		$scope.pref.statrent = "Your rental is finish";
                $scope.msg = "Your rental is finish";
                $scope.datemsg = '';
                $scope.at = '';
                $scope.pref.v = 100;
		return ;
                
            }
            else
            {
                $scope.msg = "errror";
                $scope.pref.v = 100;		
            }
        }, 1000);
        //$scope.pref.v = ($scope.pref.v + 20) % 102;
        setTimeout(function ()
        {
            $scope.dat = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
        if($scope.dat < $scope.datal.end && $scope.dat > $scope.datal.start)
        {
        	var locs = {};
        	var loc = {};
        	var c = new Car($scope.pref.vin,$scope.pref.contrat);
        	var s = new Carsit(1);
                
                	s.get_mylocation().then(function()
                	{
                    	locs = s.position;
                    	c.get_location().then(function()
                    	{
                        	loc = c.position;
                       	var a = new NameAdresse(locs, loc);
                        	//take the name of the address   
                                                    
                        	a.get_name_sitter().then(function()
                        	{
                            	a.get_name_car().then(function()
                            	{      
                                //call the google map
                               /* var ti = new timetrip(a.addloc.add, a.addlocs.add);
                                    ti.get_timet().then(function() {
                                    console.log("salope");                   
                                                       });*/
                                	directionsService = new google.maps.DirectionsService;
                                	directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
                                	var icons = {
                                    	end: new google.maps.MarkerImage(
                               // URL
                               			'img/Carli.png',
                               // (width,height)
                               			new google.maps.Size( 44, 32 ),
                               // The origin point (x,y)
                               			new google.maps.Point( 0, 0 ),
                               // The anchor point (x,y)
                               			new google.maps.Point( 22, 32 )
                              		),
                                        start: new google.maps.MarkerImage(
                               // URL
                                        'img/carlito.png',
                               // (width,height)
                                        new google.maps.Size( 44, 32 ),
                               // The origin point (x,y)
                                        new google.maps.Point( 0, 0 ),
                               // The anchor point (x,y)
                                        new google.maps.Point( 22, 32 )
                              	     )
                                     };
                                    if ($scope.date < $scope.datal.start)
        				                var end = ''+$scope.datas.num+' '+$scope.datas.nom+' ,'+$scope.datas.codepos+' '+$scope.datas.ville+', France';
        				            else if ($scope.date > $scope.datal.start)
                                        var end = $scope.datae.num+' '+$scope.datae.nom+' ,'+$scope.datae.codepos+' '+$scope.datae.ville+', France';
        				            document.getElementById("map").style.display = "block";
                                	var map = new google.maps.Map(document.getElementById('map'),
                                    {
                                		zoom: 7,
                                		center: {lat: locs.latitude, lng: locs.longitude}
                                	});
                                		directionsDisplay.setMap(map);
                                		var markersArray = [];
                                		var bounds = new google.maps.LatLngBounds;
                                		var geocoder = new google.maps.Geocoder;
                                		var service = new google.maps.DistanceMatrixService;
                                		service.getDistanceMatrix(
                                		{
                                    		origins: [a.addlocs.add],
                                    		destinations: [end],
                                    		travelMode: google.maps.TravelMode.DRIVING,
                                    		unitSystem: google.maps.UnitSystem.METRIC,
                                    		avoidHighways: false,
                                    		avoidTolls: false
                                		},
                                		function(response, status)
                                		{        
                                    		if (status !== google.maps.DistanceMatrixStatus.OK)
                                    		{
                                        			ons.notification.alert(
                                        			{
                                                        message: 'Error: ' + status,
                                                        title: 'Attention',
                                                        buttonLabel: 'OK',
                                                        animation: 'default', // or 'none'
                                                        callback: function(){}
                                        			});
                                            }
                                    		else
                                    		{
                                        		var originList = response.originAddresses;
                                        		var destinationList = response.destinationAddresses;
                                        
                                        /*document.getElementById("output").style.visibility = "visible";
                                        document.getElementById("output").style.float = "left";*/
                                        /*deleteMarkers(markersArray);*/
                                        		var showGeocodedAddressOnMap = function(asDestination) 
                                        		{
                                            		return function(results, status)
                                            		{
                                                			if (status === google.maps.GeocoderStatus.OK)
                                                			{
                                                				map.fitBounds(bounds.extend(results[0].geometry.location));
                                                /*markersArray.push(new google.maps.Marker(
                                                {
                                                    map: map,
                                                    position:                                     {
                                                        // Alert button is results[0].geometry.location
                                                }))*/;
                                                			}
                                                			else
                                                			{
                                                				ons.notification.alert(
                                                   	 			{
        			                                 			message: 'Geocode was not successful due to: ' + status,
        			                                 			title: 'Attention',
        			                                 			buttonLabel: 'OK',
        			                                 			animation: 'default', // or 'none'
        			                                 			callback: function()
                                                    					{}
        		                                   			});
                                                			}
                                            		};
                                        		};
                                        		for (var i = 0; i < originList.length; i++)
                                        		{
                                            		var results = response.rows[i].elements;
                                            		geocoder.geocode({'address': originList[i]}, showGeocodedAddressOnMap(false));
                                            		var row=[];
                                            /*$scope.items.push($scope.item);
                                            $scope.item = {};*/
                                            	for (var j = 0; j < results.length; j++)
                                            	{
                                                	geocoder.geocode({'address': destinationList[j]},
                                                	showGeocodedAddressOnMap(true)); 
                                                /*var outputDiv = document.getElementById('output');*/
                                                /*row = outputDiv.insertRow(0);*/
                                                /*row = outputDiv.insertRow(1);*/
                                                    row.dist = results[j].distance.value;
                                                	row.km = 'You are at ' + results[j].distance.text + ' from your place of return';
                                                /*row = outputDiv.insertRow(2);*/
                                            	}
                                                $scope.help = row.km;
                                                row.d = row.dist;
						$scope.pref.dist = Math.floor(row.dist);
                                                if ($scope.ex == 1 && $scope.tripmile)
                                                {
                                                	if ($scope.pref.dist > 1000)
                                                	{
                                                		$scope.pref.dist = $scope.pref.dist / 1000;
                                                		$scope.pref.dist += $scope.tripmile;
                                                	}
                                                	else if ($scope.pref.dist > 500 && $scope.pref.dist < 1000)
                                                	{
                                                		$scope.pref.dist = 1;
                                                		$scope.pref.dist += $scope.tripmile;
                                                	}
                                                	else if ($scope.pref.dist < 500)
                                                		$scope.pref.dist = $scope.tripmile;
                                                	$scope.pref.dist = Math.floor($scope.pref.dist - $scope.pref.forfai);
							row.euro = 0;
							row.euro = Math.floor($scope.pref.dist) * 0.30;
							console.log($scope.pref.dist);
							$scope.pref.consmsg = "Following the place chosen for pick-up";
                                              		$scope.pref.cons = 'You should be overcharged ' + Math.floor($scope.pref.dist) + ' KM / ' + Math.floor(row.euro) +' €';
                                                }
                                                else if ($scope.ex == 2 && $scope.tripmile)
                                                {
                                                	if ($scope.pref.dist > 1000)
                                                	{
                                                		$scope.pref.dist = $scope.pref.dist / 1000;
                                                		$scope.pref.dist = $scope.pref.dist + $scope.tripmile;
                                                	}
                                                	else if ($scope.pref.dist < 500)
                                                		$scope.pref.dist = $scope.tripmile;
                                                	else if ($scope.pref.dist < 1000 && $scope.pref.dist > 500)
                                                		$scope.pref.dist = 1 + $scope.tripmile;
							row.euro = 0;
							row.euro = Math.floor($scope.pref.dist - $scope.pref.forfai) * 0.30;
							console.log($scope.pref.dist);
                                                	if ($scope.pref.dist > $scope.pref.forfai)
                                                	{
                                                		$scope.pref.dist = $scope.pref.dist - $scope.pref.forfai;
								$scope.pref.consmsg = "Following the place chosen for pick-up";
                                              			$scope.pref.cons = 'You should be overcharged ' + Math.floor($scope.pref.dist) + ' KM / ' + Math.floor(row.euro) +' €';
                                                	}
							else if ($scope.pref.dist < $scope.pref.forfai)
							{
								$scope.pref.consmsg = "Following the place chosen for pick-up";
                                              			$scope.pref.cons = 'There wiil be ' + Math.floor($scope.pref.forfai - $scope.pref.dist) + ' KM left on your package';
							}
                                                }
                                                if ($scope.fuelmoy && $scope.tripmile)
                                                {
                                                    	if (row.d > 1000)
                                                    		row.d = row.d / 1000;
        								            else if (row.d < 500)
        								            	row.d = 0;
        								            else if (row.d < 1000 && row.d > 500)
        								            	row.d = 1; 
        								            var L = $scope.fuelmoy / 100;
        								            $scope.pref.plein = ($scope.tripmile + row.d) * L;
        								            $scope.pref.plein = Math.floor($scope.pref.plein + 1);
											$scope.pref.pri = $scope.pref.plein * 1.23;
											$scope.pref.prifill = Math.floor($scope.pref.pri + 4);
                                                }
                                                $scope.pref.v = 100;
                                            	$scope.$apply();
                                        	}
                                    	}
                                	});
                            	});
                        	});
                        });
                    });
                }
            }, 1000);
            $scope.pref.v = 100;;
            $done();
	}.bind($scope), 10);
    }.bind($scope);
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
