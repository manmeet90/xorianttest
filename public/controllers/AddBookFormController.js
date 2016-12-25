function AddBookFormController($http){
    this.bookName = "";
    this.price = 0;
    this.copies = 0;

    this.addBook = function(e){
        e.preventDefault();
        let payload = {
            bookName : this.bookName,
            price : this.price
        };
        if(this.copies){
            payload.copies = this.copies;
        }
        $http.post("http://localhost:3000/books", {
            data : payload
        }).then(response => {
            alert("book added successfully");
            window.history.back();
        }, err => alert(err.data.message));
    };

}

AddBookFormController.$inject = ["$http"];