// Budget Controller

var budgetController = (function(){

})();

// UI Controller

var UIController = (function(){

    // DOM Strings

    var DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    // Public object

    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDesc).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function(){
            return DOMStrings;
        }

    }

})();

// App Controller

var controller = (function(budgetCtrl, UICtrl){

    // Get Dom Strings

    var DOM = UICtrl.getDOMStrings();

    var ctrlAddItem = function(){
        // 1. Get input Data
        var input = UICtrl.getInput();
        console.log(input);

        // 2. Add the item to the Budget Controller

        // 3. Add the item to the UI

        // 4. Calculate Budget

        // 5. Display the budget on UI
    };



    // Setup event handler
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    // Setup Keypress Event

    document.addEventListener('keypress', function(event){
        if(event.keyCode == 13 || event.which == 13){
            ctrlAddItem();
        }
    });

})(budgetController, UIController);












