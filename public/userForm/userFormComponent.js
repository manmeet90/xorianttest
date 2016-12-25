function UserFormController(http, BASE_URL, $rootScope){
    this.login = function(){
        let payload = {
            username: this.username,
            password : this.password
        };
        http.post(`${BASE_URL}/auth/login`,{
            data : payload
        }).then(response => {
            $rootScope.loggedIn = true;
            $rootScope.loggedInUser = response.data.data;
            sessionStorage.setItem("loggedInUser", JSON.stringify($rootScope.loggedInUser));
            location.href="#/home";
        },err => alert(err.data.message));
    };

    this.register = function(){
        let payload = {
            username: this.username,
            password : this.password
        };
        http.post(`${BASE_URL}/auth/register`,{
            data : payload
        }).then(response => {
            location.href="#/login";
        },err => alert(err.data.message));
    };
}

UserFormController.$inject = ["$http", "BASE_URL", "$rootScope"];

const UserFormComponent = {
    controller : UserFormController,
    controllerAs : "vm",
    bindings:{
        type : "<"
    },
    templateUrl : "./userForm/userFormComponent.html"
};