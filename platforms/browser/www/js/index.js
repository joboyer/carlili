/*
var API_KEY = '1403d835-a9aa-4d50-8757-b590f364b90b';

var API_URL = 'https://api.mpsa.com/api/dev';
*/


var a = angular.module('my-app', ['onsen', 'ngResource', 'uiGmapgoogle-maps'/*, 'ngAnimate'*/]);

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

a.controller('initController' ,function($scope,$localstorage,$http,$log) {
	// on détecte la fin de l'initialisation de l'application
    ons.ready(function() {
		
		// l'objet pref qui stockera les préférence de l'utilisateur
		// Cet objet est détruit lorsque l'on sort de l'application
		// pour enregistrer les valeurs des préférences de l'utilisateur
		// il faut utiliser la factory $localstorage
        $scope.pref = {};
       
		// On intialise le VIN pour le créer
		$scope.pref.vin = '';
		
		// le contrat ...
        $scope.pref.contrat = '';

		// le code secure ...
        $scope.pref.code_secure = '';
        

		// et le switch.
		$scope.pref.save_vin_switch = false;
        
        $scope.pref.login = '';
        $scope.pref.pwd = '';

		// si on a déjà des préférences enregistrées dans le mobile
        if ( $localstorage.get('pwd') !== undefined ) {
			// on les charge
            $scope.pref.vin = $localstorage.get('pwd');
        }

        if ( $localstorage.get('login') !== undefined ) {
            $scope.pref.contrat = $localstorage.get('login');
        }
    });
    
   /* $scope.log = function($user, $mdp) {
        console.log("jojo");
    }*/
        $scope.charto = function(){
         var chart = c3.generate({bindto: '#chart', data:
            {
                        columns: [['essence', 0]], type: 'gauge'
            },
            gauge:
            {
    //              label:
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
            document.getElementById("pic").style.height = "20%";
            document.getElementById("pic").style.width = "40%";
            document.getElementById("pic").style.float = "left";
            document.getElementById("chart").style.display = "block";
            setTimeout(function ()
            {
                chart.load(
                {
                    columns: [['essence', 20/*maint.results.m.fuel.fuelLevel*/]]
                });
            }, 1000);
        }
            });

   /* a.controller('reqController', function($scope,$localstorage,$http,$log) {
    
    $scope.login = function(login, $mdp) {
        console.log("jojo");
        $log.info(login);
        console.log($mdp);
    }
});*/

a.controller('sqlController', function($scope,$http, $q){
   $scope.log = function($login, $mdp){
       var def = $q.defer();
       var request = $http.get(window.location.href + "js/log.php")/*({
    method: "POST",
    url: window.location.href + "js/log.php",
    data: {
        email: $login,
        pass: $mdp
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});*/

/* Check whether the HTTP Request is successful or not. */
request.success(function (data, status, header, config, response) {
    def.resolve(data);
    console.log(def.promise);
    console.log(data);
    console.log(status);
    console.log(header);
    console.log(config);
    document.getElementById("message").textContent = "You have login successfully with email "+JSON.stringify(response);
});
   };
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



