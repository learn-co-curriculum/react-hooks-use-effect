# React Side Effects

## Overview

We'll talk about how to use side-effects in our function components with the
`useEffect` hook, and how to get additional functionality in our components
beyond just returning JSX elements.

## Objectives

1. Understand side effects in programming
2. Use the `useEffect` hook to write side effects in components
3. Control when the side effects run by using a dependencies array with `useEffect`

## Side Effects

When you hear about side effects in terms of pharmaceuticals, they're often not
something to get too excited about (typically, you'd take some aspirin for its
_main effect_ of making a headache go away instead of its _side effect_ of nausea).

In terms of _programming_, a side effect is defined as:

> an operation, function or expression is said to have a side effect if it
> modifies some state variable value(s) outside its local environment, that is
> to say has an observable effect besides returning a value (the main effect) to
> the invoker of the operation. -- [Wikipedia on Side Effects][side-effects]

Put more simply, if we call a function and that function causes change in our
application _outside of the function itself_, it's considered to have caused a
_side effect_. Things like making _network requests_, accessing data from a
database, writing to the file system, etc. are common examples of side effects
in programming.

In terms of a React component, the _main effect_ of the component is to return
some JSX. That's been true of all of the components we've been working with! One
of the first rules we learned about function components is that they take in
props, and return JSX.

_However_, it's often necessary for a component to perform some _side effects_
in addition to its main job of returning JSX. For example, we might want to:

- Fetch some data from an API when a component loads
- Start or stop a timer
- Manually change the DOM
- Get the user's location

In order to handle these kinds of side effects within our components, we'll need
to use another special **hook** from React: `useEffect`.

## The useEffect Hook

To use the `useEffect` hook, we must first import it:

```js
import React, { useEffect } from "react";
```

Then, inside our component, we call `useEffect` and pass in a callback function
to run as a _side effect_:

```js
function App() {
  useEffect(
    // side effect function
    () => {
      console.log("useEffect called");
    }
  );

  console.log("Component rendering");

  return (
    <div>
      <button>Click Me</button>
      <input type="text" placeholder="Type away..." />
    </div>;
  )
}
```

If you run the example code now, you'll see the console messages appear in this
order:

- Component rendering
- useEffect called

So we are now able to run some extra code as a _side effect_ any time our
component is rendered.

> By using this Hook, you tell React that your component needs to do something
> after render. React will remember the function you passed (we’ll refer to it
> as our “effect”), and call it later after performing the DOM updates. --
> [useEffect hook][useeffect-hook]

Let's add some state into the equation, and see how that interacts with our
`useEffect` hook.

```js
function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("useEffect called");
  });

  console.log("Component rendering");

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>
        I've been clicked {count} times
      </button>
      <input
        type="text"
        placeholder="Type away..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
```

Try clicking the button or typing in the input field to trigger updates in
state. Every time state is set, we should also see those same two console
messages in the same order:

- Component rendering
- useEffect called

**By default, `useEffect` will run our side effect function every time the
component re-renders**. However, sometimes we only want to run our side effect
once. For example -- imagine we're using the `useEffect` hook to fetch some data
from an external API (a common use case for `useEffect`). How can we control
when `useEffect` will run our side effect function?

## useEffect Dependencies

React gives us a way to control when the side effect will run, by passing a
second argument to `useEffect` of a _dependencies array_. It looks like this:

```js
useEffect(
  // 1st arg: side effect (callback function)
  () => console.log("useEffect called"),
  // 2nd arg: dependencies array
  [count]
);
```

Update the `useEffect` function as above and try running the code again. Now,
the side effect will only run when the `count` variable changes. We won't see
any console messages from `useEffect` when typing in the input -- we'll only see
them when clicking the button!

We can also pass in an _empty_ array of dependencies as a second argument, like
this:

```js
useEffect(() => {
  console.log("useEffect called");
}, []); // second argument is an empty array
```

Now, the side effect will only run the _first time_ our component renders! Keep
this trick in mind -- we'll be using it again soon to work with fetching data.

## Performing Side Effects

Running a `console.log` isn't the most interesting side effect, so let's try a
couple other examples.

One kind of side effect we can demonstrate here is _updating parts of the
webpage page outside of the React DOM tree_. React is responsible for all the
DOM elements rendered by our components, but there are some parts of the webpage
that live outside of this tree. Take, for instance, the `<title>` of our page --
this is what shows up in the browser tab, like this:

![title](images/title.png)

Updating this part of the page would be considered a _side effect_, so let's use
`useEffect` to update it!

```js
useEffect(() => {
  document.title = text;
}, [text]);
```

Here, what we're telling React is:

"Hey React! When my App component renders, I also want you to update the
document's title. But you should only do that when the `text` variable changes."

Let's add another side effect, this time running a `setTimeout` function. We
want this function to _reset_ the `count` variable back to 0 after 5 seconds.
Running a `setTimeout` is another example of a side effect, so once again, let's
use `useEffect`:

```js
useEffect(() => {
  setTimeout(() => setCount(0), 5000);
}, []);
```

With this side effect, we're telling React:

"Hey React! When my App component renders, I also want you to set this timeout
function. In 5 seconds, you should update state and set the count back to 0. You
should only set this timeout function once, I don't want a bunch of timeouts
running every time my component updates. kthxbye!"

All together, here's what our updated component looks like:

```js
function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    document.title = text;
  }, [text]);

  useEffect(() => {
    setTimeout(() => setCount(0), 5000);
  }, []);

  console.log("Component rendering");

  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>
        I've been clicked {count} times
      </button>
      <input
        type="text"
        placeholder="Type away..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
```

Explore this code to familiarize yourself with `useEffect`, and see what changes
by changing the dependencies array. It's also a good idea to add some console
messages or put in a debugger to see what exactly when the side effects will
run.

## Conclusion

So far, we've been working with components solely for rendering to the DOM based
on JSX, and updating based on changes to state. It's also useful to introduce
_side effects_ to our components so that we can interact with the world outside
of the React DOM tree and do things like making network requests or setting
timers.

In the next lessons, we'll see some more practical uses for `useEffect` and get
practice handling network requests from our components.

## Resources

- [React Docs on useEffect][useeffect-hook]
- [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)

[side-effects]: https://en.wikipedia.org/wiki/Side_effect_(computer_science)#:~:text=In%20computer%20science%2C%20an%20operation,the%20invoker%20of%20the%20operation.
[useeffect-hook]: https://reactjs.org/docs/hooks-effect.html
