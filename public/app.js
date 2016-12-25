const app = angular.module("LibraryModule", ["ngRoute"]);
app.constant("BASE_URL" , "http://localhost:3000");
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $routeProvider.when("/home",{
        templateUrl : "./views/home.html"
    })
    .when("/addBook", {
        templateUrl : "./views/addBookView.html",
        controller : AddBookFormController,
        controllerAs : "vm"
    })
    .when("/issuebook", {
        templateUrl : "./views/issueBook.html"
    })
    .when("/returnbook", {
        templateUrl : "./views/returnBook.html"
    })
    .when("/login", {
        templateUrl : "./views/login.html"
    })
    .when("/register", {
        templateUrl : "./views/register.html"
    })
    .otherwise({redirectTo: "/login"});

    $locationProvider.hashPrefix("");
}]);

app.run(["$location","$rootScope","$window",
 function($location, $rootScope, $window){
    $rootScope.logout = function(){
        $rootScope.loggedIn = false;
        $rootScope.loggedInUser = null;
        sessionStorage.removeItem("loggedInUser");
        $location.path("/login");
    };

    if(sessionStorage.getItem("loggedInUser")){
        $rootScope.loggedIn = true;
        $rootScope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    } 
    $rootScope.$on('$routeChangeStart',function(event,next,current){
    	
        if(next && (next.originalPath=="/register" || next.originalPath=="/login")){
          if($rootScope.loggedIn){
              $location.path('/home');
          }else{
            console.log("allow route to trigger");
          }
        }else{
            if(!$rootScope.loggedIn){
                console.log("not authenticated redirecting to login.html");
                $location.path('/login');
            }
        }            
    });
}]);

app.component("booksList", BooksListComponent);
app.component("issueBook", issueBookComponent);
app.component("userForm", UserFormComponent);
app.controller("AddBookFormController", AddBookFormController);

angular.bootstrap(document.getElementById("main"), ["LibraryModule"]);