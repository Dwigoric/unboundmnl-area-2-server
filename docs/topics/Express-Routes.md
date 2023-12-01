# Express Routes

The route paths define the endpoints at which requests can be made.

Depending on the HTTP method used, the Express router will call the corresponding method handler function.

## CRUD Operations

The following table shows the HTTP methods and their corresponding Express router methods:

| HTTP Method | Express Router Method | CRUD Operation | Description                    |
| ----------- | --------------------- |----------------|--------------------------------|
| GET         | `router.get()`        | Read           | Retrieve information           |
| POST        | `router.post()`       | Create         | Send information to the server | 
| PUT         | `router.put()`        | Create         | Create a new resource          |
| PATCH       | `router.patch()`      | Update         | Update an existing resource    |
| DELETE      | `router.delete()`     | Delete         | Delete an existing resource    |

## Route Paths

The route paths define the endpoints at which requests can be made.

Route paths can be strings, string patterns, or regular expressions.

### Resource Naming

This project follows the industry standard of naming conventions,
which you may find [here](https://restfulapi.net/resource-naming/).

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
    </category>
</seealso>
