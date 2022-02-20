// Call external library
// Storage Controller
const StorageCtrl = (function () {
  // Public Methods
  return {
    storeItem: function (item) {
      let items;
      // Check if there is any items in local storage
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push the new item
        items.push(item);
        // Set local storage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem('items'));
        // Push the new items
        items.push(item);
        // Re set local storage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },

    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },

    updateItemStorage: function (updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function () {
      localStorage.removeItem('items');
    },
  };
})();

// Item Controller
const ItemCtrl = (function () {
  // Item Constructor
  const Item = function (id, name, calories, date) {
    this.id = id;
    this.name = name;
    this.calories = calories;
    this.date = date;
  };

  // Data Structure / State
  const data = {
    // items: [
    //   {
    //     id: 0,
    //     name: 'Steak Dinner',
    //     calories: 1200,
    //   },
    //   {
    //     id: 1,
    //     name: 'Cookies',
    //     calories: 400,
    //   },
    //   {
    //     id: 2,
    //     name: 'Eggs',
    //     calories: 300,
    //   },
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories, date) {
      let ID;

      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      newItem = new Item(ID, name, calories, date);
      console.log(newItem);
      // Add to items array
      data.items.push(newItem);

      // Return new item
      return newItem;
    },

    getTotalCalories: function () {
      let total = 0;

      // loop thu items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });

      // Set total calories in data structure
      data.totalCalories = total;

      // Return Total
      return data.totalCalories;
    },

    getItemById: function (id) {
      let found = null;
      // Loop throught items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    updatedItem: function (name, calories, date) {
      // Caloris to number with parsInt
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          item.date = date;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function (id) {
      // Get the ids
      const ids = data.items.map(function (item) {
        return item.id;
      });

      // Get Index
      const index = ids.indexOf(id);

      // Delete Item
      data.items.splice(index, 1);
    },

    clearAllItems: function () {
      data.items = [];
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    itemDate: '#item-date',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    totalCalories: '.total-calories',
  };

  // Public Methods
  return {
    populateItemList: function (items) {
      let html = '';
      // Loop through items
      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories - Date: ${item.date}</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
         </li>`;
      });
      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
        date: document.querySelector(UISelectors.itemDate).value,
      };
    },

    addListItem: function (item) {
      // Show list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // Add Html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories - Date: ${item.date}</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      // Inert Item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },

    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn Node list into array
      listItems = Array.from(listItems);
      //console.log(listItems);
      // Loop thrught the array
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories - Date: ${item.date}</em>
          <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
        }
      });
    },

    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },

    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
      document.querySelector(UISelectors.itemDate).value = '';
    },

    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemCtrl.getCurrentItem().calories;
      document.querySelector(UISelectors.itemDate).value =
        ItemCtrl.getCurrentItem().date;
      UICtrl.showEditState();
    },

    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn node list in to an Array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },

    hideList: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },

    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },

    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function () {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

// App Controller
const App = (function (ItemCtrl, StorageCtrl, UICtrl) {
  // Log all Items in an array
  //console.log(ItemCtrl.logData());

  // Load event listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // Disable Submit on Enter
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    // Actual Update item event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);

    // Delete button event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDeleteSubmit);

    // Back button event
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', itemBackSubmit);

    // Clear button event
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);

    // Load DataPicker
    document.addEventListener('DOMContentLoaded', initDataPicker);
  };

  // Init Calendar
  const initDataPicker = function (e) {
    // Get the UI Selectors
    const UISelectors = UICtrl.getSelectors();
    // Get the calendar ID
    const elem = document.querySelector(UISelectors.itemDate);
    // Select specific option for this calendar
    const options = {
      format: 'dd/mm/yyyy',
      autoClose: true,
      firstDay: 1,
      showClearBtn: true,
    };

    const instance = M.Datepicker.init(elem, options);
  };

  // Add Item Submit
  const itemAddSubmit = function (e) {
    //console.log('Add Item Submit');

    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    if (input.name !== '' && input.calories !== '' && input.date !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories, input.date);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in localStorage
      StorageCtrl.storeItem(newItem);

      // Clear fields
      UICtrl.clearInput();
    } else {
      // alert('Please fill in all fields');
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please fill in all fields!',
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }

    e.preventDefault();
  };

  // Click Edit Item
  const itemEditClick = function (e) {
    // Target the item inside the target
    if (e.target.classList.contains('edit-item')) {
      // Get list item id (item-0, item-1, etc...)
      const listId = e.target.parentNode.parentNode.id;

      // Breack the ID into an array
      const listIdArray = listId.split('-');

      // Get the actual ID
      const id = parseInt(listIdArray[1]);

      // Get Item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to from
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Update Item Submit
  const itemUpdateSubmit = function (e) {
    // Get item input
    const input = UICtrl.getItemInput();

    // Update Item
    const updatedItem = ItemCtrl.updatedItem(
      input.name,
      input.calories,
      input.date
    );

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to the UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    // Clear Inputs after update the item
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete button Event
  const itemDeleteSubmit = function (e) {
    // // Get current item
    // const currentItem = ItemCtrl.getCurrentItem();

    // // Delete item from the data strucure
    // ItemCtrl.deleteItem(currentItem.id);

    // // Delete from UI
    // UICtrl.deleteListItem(currentItem.id);

    // // Get total calories
    // const totalCalories = ItemCtrl.getTotalCalories();

    // // Add total calories to the UI
    // UICtrl.showTotalCalories(totalCalories);

    // // Delete from local storage
    // StorageCtrl.deleteItemFromStorage(currentItem.id);

    // // Clear Inputs after update the item
    // UICtrl.clearEditState();

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        // Delete item from the data strucure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // Clear Inputs after update the item
        UICtrl.clearEditState();

        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });

    e.preventDefault();
  };

  const clearAllItemsClick = function () {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete all items!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete all items from data strucure
        ItemCtrl.clearAllItems();

        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();

        // Add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Clear UI
        UICtrl.removeItems();

        // Clear from LocalStorage
        StorageCtrl.clearItemsFromStorage();

        // Hide UL line
        UICtrl.hideList();

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const itemBackSubmit = function (e) {
    UICtrl.clearEditState();
  };

  // Public methods
  return {
    init: function () {
      // Fetch Items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if (items.length === 0) {
        // Hide the list of items
        UICtrl.hideList();
      } else {
        // Pouplate list with items
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      // Populate UI with Items
      UICtrl.populateItemList(items);

      // Set Initial State
      UICtrl.clearEditState();

      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
