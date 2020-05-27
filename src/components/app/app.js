import React, {Component} from "react";

import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";

import "./app.css";

class App extends Component {

    maxId = 100;

    state = {
      todoData : [
        {label: 'Drink Coffee', important: false, id:1},
        {label: 'Make Awesome App', important: true, id:2},
        {label: 'Have a lunch', important: false, id:3}
      ]
    }

    deleteItem = (id) => {
        this.setState( ({ todoData }) => {
            const idx = todoData.findIndex((el) => el.id === id);
            // todoData.splice(idx,1)    this mutates state in setState method, which harmful   [a, b, c , d , e]
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
        const newItem = {
          label: text,
          important: false,
          id: this.maxId++
        }
        // add element in Array
        this.setState(({ todoData }) => {
            const newArr = [...todoData, newItem];
            return {
              todoData: newArr
            }
        })
    }

    render(){
        const { todoData } = this.state;

        return (
          <div className="todo-app">
              <AppHeader toDo={1} done={3} />
              <div className="top-panel d-flex">
                  <SearchPanel />
                  <ItemStatusFilter />
              </div>
              <TodoList todos={todoData} 
                        onDeleted={ this.deleteItem } />

              <ItemAddForm onItemAdded={this.addItem} />
          </div>
        );
    }
}

export default App;
