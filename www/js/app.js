angular.module("saglamlar_sigorta", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","saglamlar_sigorta.controllers", "saglamlar_sigorta.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Saglamlar" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "saglamlar_sigorta",
				storeName : "saglamlar_sigorta",
				description : "The offline datastore for Saglamlar Sigorta app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("saglamlar_sigorta.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("tr");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("tr");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?saglamlarsigorta\.com\.tr/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("saglamlar_sigorta",{
		url: "/saglamlar_sigorta",
			abstract: true,
			templateUrl: "templates/saglamlar_sigorta-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("saglamlar_sigorta.about_us", {
		url: "/about_us",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.acentelik", {
		url: "/acentelik",
		cache:false,
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-acentelik.html",
						controller: "acentelikCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.dashboard", {
		url: "/dashboard",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.faqs", {
		url: "/faqs",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.hakkimizda", {
		url: "/hakkimizda",
		cache:false,
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-hakkimizda.html",
						controller: "hakkimizdaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.menu_1", {
		url: "/menu_1",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-menu_1.html",
						controller: "menu_1Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.menu_2", {
		url: "/menu_2",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-menu_2.html",
						controller: "menu_2Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.online_teklif", {
		url: "/online_teklif",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-online_teklif.html",
						controller: "online_teklifCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("saglamlar_sigorta.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"saglamlar_sigorta-side_menus" : {
						templateUrl:"templates/saglamlar_sigorta-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/saglamlar_sigorta/dashboard");
});
