#1. What is the difference between Component and PureComponent? Give
an example where it might break my app.

answer: Main difference between Component and PureComponent is that PureComponent, by default, uses life cycle "shouldComponentUpdate", which will only perform a shallow comparision of the props passed. That allows the PureComponent to work faster, though, with a couple of rules like: props in your Component, that will be passed to PureComponent, should not be mutated (shallow comparision will check only refferences), and all of the child components of a PureComponent, shoud be PureComponen(s) as well.

#2. Context + ShouldComponentUpdate might be dangerous. Why is that?

answer: Problem would appear when you will update the context and expect it to be updated on the child components down the line and if there are components that use shouldComponentUpdate with false return value, or a PureCompoent, the value won't be changed for them.

#3. Describe 3 ways to pass information from a component to its PARENT.

answer: 1. Callback function passed to child as a prop, with return value, that would be set up on necessary event inside the child component. 2. Context 3. 3rd party libraries like redux 4. Using forwardref, to imperatively change ref element behavior (if that counts as a "information")

#4. Give 2 ways to prevent components from re-rendering.

answer: Well, first and most obvious, for legacy react it would be to use PureComponent or shouldComponentUpdate hook. In modern versions or React, i'd make sure that hooks like useCallback and useMemo are used, to prevent redundunt renders and, also, we could wrap component in React.memo, to make sure, that component will rerender only if props will change (not because parent component rerendered).

#5. What is a fragment and why do we need it? Give an example where it might break my app.

answer: Fragment is a useful "tool" that would allow us to avoid using wrapping tags like, for example, div. Instead we would use fragment, which, will wrap out list components and won't be shown in DOM tree as an additional tag.

#6. Give 3 examples of the HOC pattern.

answer: redux connect, context providers (might be theme or other information useful for other components in the app), any other component that would wrap another component and the return component in exactly the same way it was, but provided with some information or functionality by the HOC.

#7. What's the difference in handling exceptions in promises, callbacks and async…await?

answer: Promise: then...catch
Callbacks: manually throwing by conditional statements
Async: usint try..catch block

#8. How many arguments does setState take and why is it async

answer: setState has 2 arguments, the second is optional. Second argument is a callback that will be executed after state updates and component rerendered. setState is async because it stacks the values for performance reasons

#9. List the steps needed to migrate a Class to Function Component.

answer: In order to migrate to functional component and fully use their potential, we need to migrate to a proper React version.

        Given a class that needs to be changed to a function we need:

        1. Change class declaration to function (or funciton expression)
        2. remove constructor
        3. change life cycle methods with hooks
        4. change methods to functions
        5. change state management to hooks
        6. remove render method
        7. this keyword is not needed

#10. List a few ways styles can be used with components

answer: 1. Well, first would be trough style attribute directly in tag (do not recommend, just a technical possibility) 2. Import .css file directly into a component 3. css module 4. 3rd party libraries like styled components

#11. How to render an HTML string coming from the server.

answer: dangerouslySetInnerHTML (Should not be used and avoided in any possible way). There are 3rd party libraries to parse html.
