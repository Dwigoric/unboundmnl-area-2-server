# Coding Standards

This page contains the coding standards for the %product%.

## General

In developing the product, we must follow the
<tooltip term='es6'>ES6</tooltip> standard.
Both repositories are written in
<tooltip term='es6'>ES6</tooltip>.

## Variable Declaration

<tldr>
    <p><strong>Always</strong> use <code>const</code> unless you need to reassign the variable.</p>
</tldr>

All variables must be declared using the `const` keyword.
However, some variables may be declared using the `let` keyword
if they are to be reassigned later on.

> Note that in JavaScript, `const` does not mean that the variable is immutable.
> It only means that the variable cannot be reassigned.
> If you have an object declared using `const`, you can still modify its properties.
> If you want to make an object immutable, you can use the
> `Object.freeze()` method.
{ style='note' }

### Example { id="variables-example" }

```javascript
// Do this
const a = 1

// NEVER this
var a = 1

// Sometimes this
let a = 1
```

## Equality Operators

<tldr>
    <p><strong>Always</strong> use <code>===</code> and <code>!==</code>.</p>
</tldr>

All equality operators must be strict.
This means that you must use `===` and `!==` instead of `==` and `!=`.

### Example { id="equality-operators-example" }

```javascript
// Do this
if (a === b) {
    // ...
}

// NEVER this
if (a == b) {
    // ...
}
```


<seealso>
    <category ref="uh">
        <a href="Admin.md" />
        <a href="Authenticating-Logging-In.md" />
        <a href="Loans.md" />
        <a href="Deposits.md" />
        <a href="Profiles.md" />
    </category>
    <category ref="ds">
        <a href="Naming.md" />
        <a href="Comments.md" />
        <a href="Code-Style.md" />
        <a href="Git-Commit-Messages.md" />
        <a href="Vue.md"></a>
    </category>
</seealso>
