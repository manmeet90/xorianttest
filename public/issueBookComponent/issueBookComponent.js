function issueBookController(BASE_URL, http){
    
    this.$onInit = function(){
        this.getAllUsers();
        this.getAllBooks();
    };

    this.getAllBooks = function(){
        http.get(`${BASE_URL}/books`)
        .then(response => {
            this.books = response.data.data;
        }, err => {
            alert(err.data.message);
        });
    };

    this.getAllUsers = function(){
        http.get(`${BASE_URL}/users`)
        .then(response => {
            this.users = response.data.data;
        }, err => {
            alert(err.data.message);
        });
    };

    this.issueBook = function(){
        let payload = {
            userId : this.user.id,
            bookId : this.book.id
        };
        http.post(`${BASE_URL}/books/issue/1`,{
            data : payload
        }).then(response =>{
            alert(response.data.data.message);
        }, err => {
            alert(err.data.message);
        });
    };

    this.returnBook = function(){
        let payload = {
            userId : this.user.id,
            bookId : this.book.id
        };
        http.post(`${BASE_URL}/books/issue/2`,{
            data : payload
        }).then(response =>{
            alert(response.data.data.message);
        }, err => {
            alert(err.data.message);
        });
    };
}

issueBookController.$inject = ["BASE_URL", "$http"];

const issueBookComponent = {
    controller : issueBookController,
    controllerAs : "vm",
    bindings : {
        "type" : "<"
    },
    templateUrl : "./issueBookComponent/issueBookComponent.html"
};