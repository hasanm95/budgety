// Budget Controller
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(current){
            sum += current.value;
        });
        data.totals[type] = sum;
    };

    return{
        addItem: function(type, desc, val){
            var newItem, ID;

            // Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    
            }else{
                ID = 0;
            }
            
            // Create new item based on type 'exp' or 'inc'
            if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            }else{
                newItem = new Income(ID, desc, val);
            }

            // Push it into our data structure
            data.allItems[type].push(newItem);

            // Return the new Element
            return newItem;
        },
        deleteItem: function(type, id){
            var ids, index;

            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function(){
            // Calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');

            // Calcultate Budget = income - expense
            data.budget = data.totals['inc'] - data.totals['exp'];

            // Calculate Percentage = (expense/income) * 100
            if(data.totals['inc'] > 0){
                data.percentage = Math.round((data.totals['exp'] / data.totals['inc']) * 100);    
            }else{
                data.percentage = -1;
            }
        },
        getBudget: function(){
            return{
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        },
        calculatePercentage: function(){
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPerc;
        },
        testing: function(){
            console.log(data);
        }
    }


})();


// UI Controller
var UIController = (function() {

    // Selectors
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expenseperceLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
    };

    // Formatting Number

    var formatNumber = function(num, type){
        var numb, int, dec;

        numb = Math.abs(num);
        numb = numb.toFixed(2);
        numbSplit = numb.split('.');
        int = numbSplit[0];
        dec = numbSplit[1];

        if(int.length > 3){
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        return (type == 'exp' ? '-' : '+') + int + '.' + dec;
    };
    var nodelistForeach = function(list, callback){
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    // Public Methods

    return {
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        addListItem: function(obj, type){
            var html, newHtml, element;

            if(type === 'exp'){
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // insert new element to UI
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFieds: function(){
            var fields, arrFields;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            arrFields = Array.prototype.slice.call(fields);
            arrFields.forEach(function(current, index, array){
                current.value = '';
            });
            arrFields[0].focus();
            // for (var i = 0; i < fields.length; i++) {
            //     fields[i].value = '';
            // }
            // fields[0].focus();
        },
        displayBudget: function(obj){
            var type = obj.budget >= 0 ? 'inc' : 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage > 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = '----';
            }
        },
        displayPercentages: function(percentage){
            var fields = document.querySelectorAll(DOMStrings.expenseperceLabel);
            nodelistForeach(fields, function(current, index){
                if(percentage[index]  > 0){
                    current.textContent = percentage[index] + '%';
                }else{
                    current.textContent = '---';
                }
                
            });
        },
        displayDate: function(){
            var now, year, month, months;

            now = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changedType: function(){
            var fields = document.querySelectorAll(DOMStrings.inputType + ',' + DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            nodelistForeach(fields, function(current, index){
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
        },
        getDOMStrings: function(){
            return DOMStrings;
        }
    };


})();


// GLOBAL App Controller
var controller = (function(budgetCtrl, UICtrl) {
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMStrings();

        // Click Event 
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        // Keypress Event
        document.addEventListener('keypress', function(event){
            if(event.keyCode == 13 || event.which  == 13){
                ctrlAddItem();
            }
        });

        // Delete Event
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        // Change Event
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function(){

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        var budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentage = function(){
        // 1. Caluculate Percentage
        budgetCtrl.calculatePercentage();

        // 2. Get Percentages
        var percentages = budgetCtrl.getPercentages();

        // 3. Display Percentages
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function(){
        var input, newItem;

            // 1. Get the field input data 
            input = UICtrl.getInput();
            if(input.description !== "" && !isNaN(input.value) && input.value > 0){

                // 2. Add the item to the budget Controller   
                newItem = budgetCtrl.addItem(input.type, input.description, input.value);

                // 3. Add the item to the UI 
                UICtrl.addListItem(newItem, input.type);

                // 4. Clear Input Fields
                UICtrl.clearFieds();

                // 5. Update Budget
                updateBudget();

                // 6. Update Percentages
                updatePercentage();
            }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseFloat(splitID[1]);

            // 1. Delete Item from data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update UI
            updateBudget();

            // 4. Update Percentages
            updatePercentage();
        }
    };

    return {
        init: function(){
            console.log('Application has started');
            UICtrl.displayDate();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: '-----'
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);


controller.init();

