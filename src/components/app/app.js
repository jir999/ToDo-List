import React, {Component} from "react";

import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";

import "./app.css";

class App extends Component {

    maxId = 1;

    state = {
      todoData : [
        this.createToDoItem("Drink Coffee"),
        this.createToDoItem("Make Awesome App"),
        this.createToDoItem("Have a lunch")
      ],
      term: '',
      filter: 'all'      // active, all, done 
    }

    createToDoItem(label){
        return {
          label,
          important: false,
          done: false,
          id: this.maxId++
        }
    }

    deleteItem = (id) => {
        this.setState( ({ todoData }) => {
            const idx = todoData.findIndex((el) => el.id === id);
            // todoData.splice(idx,1)    this mutates (state) parametr in setState method, which harmful   [a, b, c , d , e]
            const before = todoData.slice(0,idx);       // doesn't mutate current state     [a, b]
            const after = todoData.slice(idx + 1);      // doesn't mutate current state     [d, e]
            const newArray = [...before, ...after];
            return {
              todoData: newArray
            }
        })
    }

    addItem = (text) => {
        // generate id ?   maxID
        const newItem = this.createToDoItem(text);
        // add element in Array
        this.setState(({ todoData }) => {
            const newArr = [...todoData, newItem];
            return {
              todoData: newArr
            }
        })
    }

    toggleProperty(arr, id, propName){
        const idx = arr.findIndex((el) => el.id === id);

        // 1. update Object
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};  // ['done'] : !oldItem['done']

        // 2. construct new Array
        return [
            ...arr.slice(0, idx), 
            newItem,
            ...arr.slice(idx + 1)
        ];
    }

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
        //     const idx = todoData.findIndex((el) => el.id === id);      Variant 1

        //     // 1. update Object
        //     const oldItem = todoData[idx];
        //     const newItem = {... oldItem, done: !oldItem.done}

        //     // 2. construct new Array
        //     const newArray = [...todoData.slice(0,idx), newItem, ...todoData.slice(idx + 1)];

            return {
              todoData: this.toggleProperty(todoData, id, 'done')         // Variant 2
            }
        })
    }

    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
        //     const idx = todoData.findIndex((el) => el.id === id);      Variant 1

        //     // 1. update Object
        //     const oldItem = todoData[idx];
        //     const newItem = {... oldItem, done: !oldItem.important}

        //     // 2. construct new Array
        //     const newArray = [...todoData.slice(0,idx), newItem, ...todoData.slice(idx + 1)];

            return {
                todoData: this.toggleProperty(todoData, id, 'important')    // Variant 2
            }
        })
    }

    onSearchChange = (term) => {
        this.setState({term});
    }

    onFilterChange = (filter) => {
        this.setState({filter});
    }

    search(items, term){
        if(term.length === 0){
            return items;
        }
        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term) > -1;
        });
    }

    filter(items, filter){
        switch(filter){
            case 'all' :
                return items;
            case 'active' :
                return items.filter((item) => !item.done);
            case 'done' :
                return items.filter((item) => item.done);
            default:
                return items;
        }
    }

    render(){
        const { todoData, term, filter } = this.state;

        const visibleItems = this.filter(this.search(todoData, term) , filter);

        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
          <div className="todo-app">
              <AppHeader toDo={todoCount} done={doneCount} />
              <div className="top-panel d-flex">
                  <SearchPanel onSearchChange={this.onSearchChange} />
                  <ItemStatusFilter filter={filter} 
                                    onFilterChange={this.onFilterChange} />
              </div>
              <TodoList todos={visibleItems} 
                        onDeleted={ this.deleteItem } 
                        onToggleImportant={this.onToggleImportant}
                        onToggleDone={this.onToggleDone} />

              <ItemAddForm onItemAdded={this.addItem} />
          </div>
        );
    }
}

export default App;
