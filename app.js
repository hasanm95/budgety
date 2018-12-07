// Budget Controller

var budgetController = (function(){

})();

// UI Controller

var UIController = (function(){

})();

// App Controller

var controller = (function(budgetCtrl, UICtrl){

    var ctrlAddItem = function(){
        // 1. Get input Data

        // 2. Add the item to the Budget Controller

        // 3. Add the item to the UI

        // 4. Calculate Budget

        // 5. Display the budget on UI
    };



    // Setup event handler
    document.querySelector('.add__btn').addEventListener('click', function(){
        ctrlAddItem();
    });

    // Setup Keypress Event

    document.addEventListener('keypress', function(event){
        if(event.keyCode == 13 || event.which == 13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);












