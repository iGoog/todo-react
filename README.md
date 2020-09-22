## React Hooks TODO App

This is a quick TODO App demonstrating the use of React with hooks. It was bootstrapped with
create-react-app. Here's a rundown of the App.js file, going over many of the caveats.

First, we import React and the hooks the component uses:
```
import React, { useState, useRef } from 'react';
```

We begin our component function, that will return jsx:
```
function App() {

    ...

    return (
        <div className="App">
            ...
        </div>
    );
}

export default App;
```
We want an efficient way of generating unique key indexes for our list of todos inside this component. 
An incrementing counter would do the trick.
If we put a local mutable variable into the App function like:
```
let keyGenerator = 0; 
```
and update it with `keyGenerator++` in a function, react will clobber it reset it to 0 on render.
This is confusing behavior to js devs, in that
react is managing the lifecycle of the App function, and kills the closure that would normally
be accessible inside the `App()` function.


We can't use the closure of a React functional component,  
but we can use the useRef hook to keep a mutable state value. 
We can reference the ref's state via `refName.current`.

```
const keyGenerator = useRef(0);
// keyGenerator.current++
```
Updating the value does not trigger a render, so the ref is not "reactive". 
If we need a "reactive" state, we should use the useState hook.
```
const [todoList, setTodoList] = useState([]);
const [todoItem, setTodoItem] = useState("");
```
The useState hook returns an array of two values that, by convention, 
we use ES6 destructuring to 
get to an immutable stateful value (`todoList`, `todoItem`), 
and a function that is the only way to replace that value (`setTodoList`, `setTodoItem`).  
When these setter functions are called, react compares the old state to the new state,
and if the value has changed it updates the state and triggers rerendering.

Updating the list items will be managed by three events:
 1. The user form is submitted, and the submit event adds the item to the end of the todo list and clears the entry field.
 2. The value of the input is changed, and we update the todoList value to the new value. 
 3. A delete link is clicked and an existing event is removed from the list.

When we handle an event, we call it an event handler. By convention, we name these functions
by prefixing their name with "handle".
```
const handleSubmit = (e) => {
    e.preventDefault();
    setTodoList([
        ...todoList,
        {key: keyGenerator.current++, value: e.target.todoItem.value}
        ]);
    setTodoItem("");
}

const handleDelete = (e, key) => {
    e.preventDefault();
    setTodoList(todoList.filter((el)=>el.key!==key));
}
```
As you can see, these two event handlers update the state with the useState setter functions,
and additionally reference and update the keyGenerator reference. Take note of the spread operator
being used to make a copy of old todoList, while adding new values to it. If you modify the 
todoList using an "in place" function (ie: `arr.push(val)`), and then try the useState setter - 
the changes will not be rendered.

Here's the fleshed out jsx:
```
<div className="App">
  <form onSubmit={handleSubmit}>
      <label>
          Todo Item:
          <input
              type="text"
              name="todoItem"
              value={todoItem}
              onChange={e => setTodoItem(e.target.value)}
          />
          <ul>
              {todoList.map((todoListItem)=>
                  <li key={todoListItem.key}>
                      {todoListItem.value}
                      {" "}
                      <a
                          role="button"
                          href={"#"+todoListItem.key}
                          onClick={(e)=> handleDelete(e, todoListItem.key)}
                      >x</a>
                  </li>
              )}
          </ul>
      </label>
  </form>
</div>
```
The basic structure is a form with a text input where you can enter the new TODO items.
Beneath the form is an unordered list which has anchor links to delete each list item.
Here, I have used three different ways managing the events.
 1. The user form directly references the handleSubmit function. `<form onSubmit={handleSubmit}>`
 2. The input is bound to the todoItem, and instead of writing a separate handleChange event
handler, I have inlined the event function to update the todoItem state without a separate handler. 
`onChange={e => setTodoItem(e.target.value)}`
 3. The link triggering the delete event does not have the key by default, so I have used a fat arrow function
 that passes the key to the event handler: onClick={(e)=> handleDelete(e, todoListItem.key)}
 
A few other details worth noting: 
 - jsx collapses the whitespace between elements, so there is a `{" "}` to add a space between the todo list item 
 and the delete button.
 - jsx can render an array of jsx elements, so `todoList.map((todoListItem)=>...` gets us through our list.
 - In terms of style, when there are more than one HTML attributes in an element, they are put on separate lines.
 
And there we have it... A simple TODO app using React.js


****
****
****

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

