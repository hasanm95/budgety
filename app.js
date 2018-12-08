// Budget Controller
var budgetController = (function(){

    // Expense Constructor
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Income Constructor
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Data Structure
    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    // Public methods to inherit form other modules
    return {
        addItem: function(type, desc, val){
            var newItem, ID, dataType;

            dataType = data.allItems[type];

            // ID = [1,2,3,4] next ID = 5
            // ID = [1,2,7,9] next ID = 10
            // ID = last id + 1

            // Create new ID
            if(dataType.length > 0){
                ID = dataType[dataType.length - 1].id + 1;
            }else{
                ID = 0;
            }

            // Create new item based on Inc or Exp
            if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }else{
                newItem = new Income(ID, desc, val);
            }

            // Push it into our data structure
            dataType.push(newItem);
            
            // Return the new Element
            return newItem;
        },
        testing: function(){
            console.log(data);
        }
        
    };














})();

// UI Controller
var UIController = (function(){

    // DOM Strings
    var DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
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
        },
        addListItem: function(item, type){
            var html, newHtml, element;

            if(type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix">div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', item.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }
    }

})();

// App Controller

var controller = (function(budgetCtrl, UICtrl){

    // Setup Event Listener
    var setupEventListener = function(){
        // Get Dom Strings
        var DOM = UICtrl.getDOMStrings();

        // Setup event handler
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Setup Keypress Event
        document.addEventListener('keypress', function(event){
            if(event.keyCode == 13 || event.which == 13){
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function(){
        var input, newItem
        // 1. Get input Data
        input = UICtrl.getInput();

        // 2. Add the item to the Budget Controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate Budget

        // 5. Display the budget on UI
    };

    return {
        init: function(){
            console.log('Application has started');
            setupEventListener();
        }
    }
})(budgetController, UIController);


controller.init();









