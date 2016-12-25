function BooksListController($http, BASE_URL){
    let vm = this;
    this.books = [];
    this.$onInit = function(){
        this.getAllBooks();
    };

    this.deleteBook = function(bookId){
        if(bookId){
            $http.delete(`${BASE_URL}/books/${bookId}`)
            .then(response => {
                alert(response.data.data.message);
                this.getAllBooks();
            }, err => {
                alert(err.data.message);
            });
        }
    };

    this.getAllBooks = function(){
        $http.get(`${BASE_URL}/books`)
        .then(response => {
            this.books = response.data.data;
        });
    };
}

BooksListController.$inject = ["$http", "BASE_URL"];

const BooksListComponent = {
    controller : BooksListController,
    templateUrl : "./booksList/list.html"
};
