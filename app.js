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

    var calculateTotal = function(type){
        var sum = 0;
        console.log()
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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
        calculateBudget: function(){
            // Calculate Total Incomes and Expenses
            calculateTotal('inc');
            calculateTotal('exp');

            // Calculate Budget Income - Expenses
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate Percentage

            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },
        getBudget: function(){
            return{
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        deleteItem: function(type, id){
            var ids, index;
            // id = 3
            // ids = [1,2,3,5,7,8]
            // index = 2
            
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
            
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
        container: '.container',
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
    };

    // Public object
    return{
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        addListItem: function(item, type){
            var html, newHtml, element;

            if(type === 'inc'){
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', item.id);
            newHtml = newHtml.replace('%description%', item.description);
            newHtml = newHtml.replace('%value%', item.value);
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function(){
            var fieldsArr, fields;

            fields = document.querySelectorAll(DOMStrings.inputDesc +', '+ DOMStrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(cur, index, array){
                cur.value = '';
            });
            fieldsArr[0].focus();
        },
        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage;
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }
            
        }
    }

})();

// App Controller

var controller = (function(budgetCtrl, UICtrl){

    // Setup Event Listener
    var setupEventListener = function(){
        // Get Dom Strings
        var DOM = UICtrl.getDOMStrings();

        // Setup click event handler
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Setup Keypress Event
        document.addEventListener('keypress', function(event){
            if(event.keyCode == 13 || event.which == 13){
                ctrlAddItem();
            }
        });

        // Setup Delete event handler
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    var updateBudget = function(){
         // Calculate Budget
        budgetCtrl.calculateBudget();

        // Return Budget
        var budget = budgetCtrl.getBudget();

        // Update UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function(){
        var input, newItem
        // 1. Get input Data
        input = UICtrl.getInput();

        // 2. Add the item to the Budget Controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        if(input.description != "" && !isNaN(input.value) && input.value > 0){
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();

            // 4. Calculate Budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the ite form UI

            // 3. Update Budget
        }
    }

    return {
        init: function(){
            console.log('Application has started');
            setupEventListener();
            UICtrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: '----'
            });
        }
    }
})(budgetController, UIController);


controller.init();









