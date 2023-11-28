# Comments

As much as possible, the language used for comments must be English.

## Inline Comments

Inline comments must be written in `//` and must be placed above the line they
refer to.

## Block Comments

Block comments must be written in `/* */` and must be placed above the block
they refer to.

## Example { id="comments-example" }

```javascript
// This is an inline comment

/*
 * This is a block comment
 */
```

> Some IDEs allow you to create a block comment by selecting a block of code and
> pressing <shortcut>Ctrl</shortcut><shortcut>Shift</shortcut><shortcut>/</shortcut>.
{ style='note' }

### Block Comments for Methods

Block comments for methods must contain at least the following:

* A description of the method
* A description of the parameters
* A description of the return value, if any

```javascript
/**
 * This is a block comment for a method
 *
 * @param {string} param1 This is the first parameter
 * @param {string} param2 This is the second parameter
 * @returns {string} This is the return value
 */
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
        <a href="Code-Style.md" />
        <a href="Git-Commit-Messages.md" />
    </category>
</seealso>
