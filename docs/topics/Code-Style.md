# Code Style

> If you are using VS Code or WebStorm,
> you can install the Prettier and ESLint extensions
> to automatically format your code. Both repositories
> contain Prettier and ESLint rules for code style.
> You can find them in the `.prettierrc` and `.eslintrc` files
> respectively.

## Indentation

All indentation must be done using **spaces**.
One indentation level is equal to **4 spaces**.

## Line Length

All lines must not exceed **25 characters**.

## Semicolons

All statements must **NOT** end with a semicolon (`;`).

## Braces

All braces must be placed on the same line as the statement they refer to.

### Example { id="braces-example" }

```javascript
if (true) {
    // ...
}
```

## Spacing

### Operators

All operators must be surrounded by **spaces**.

#### Example { id="spacing-operators-example" }

```javascript
const a = 1 + 2
```

### Keywords

All keywords must be followed by a **space**.

#### Example { id="spacing-keywords-example" }

```javascript
if (true) {
    // ...
}
```

### Commas

All commas must be followed by a **space**.

#### Example { id="spacing-commas-example" }

```javascript
const a = [1, 2, 3]
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
        <a href="Git-Commit-Messages.md" />
    </category>
</seealso>
