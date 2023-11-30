# Components

Components are the building blocks of Vue applications. A component is
essentially a Vue instance with pre-defined options. Registering a component in
Vue using Composition is straightforward:

```javascript
<script setup>
import { ref } from 'vue'
    
const count = ref(0)
    
function increment() {
    count.value++
}
</script>
````
```html
<template>
    <button @click="increment">
        Count is: {{ count }}
    </button>  
</template>
```
```html
<style scoped>
button {
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
}
</style>
```

The sample component above is a simple button that increments a counter when
clicked.

## Structure

For this project, the setup script must be first, followed by the template and
then the style. The style is optional.

The setup script is a single script tag with the attribute `setup`.
The template is a single template tag.
The style is a single style tag with the attribute `scoped`.

## Directories

View components are stored in the `src/views` directory, while
components that are used by views are stored in the `src/components`.

## Reactivity

The `ref` function is used to create a reactive reference. This means that
whenever the value of the reference changes, the component will be re-rendered.

If you want a reactive primitive variable, you must use the `ref` function.

### Example { id="reactivity-example" }

```javascript
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
    count.value++
}
</script>
```

For objects, such as arrays, you must use the `reactive` function.

### Example { id="reactivity-example-2" }

```javascript
<script setup>
import { reactive } from 'vue'

const state = reactive({
    count: 0
})

function increment() {
    state.count++
}

// `state` cannot be modified directly
// state = { count: 1 }
    
// `state` can be modified like this
state.count = 1
    
// `state` can also be modified like this
Object.assign(state, { count: 1 })

</script>
```

Do **NOT** use the `ref` function for objects.

### Example { id="reactivity-example-3" }

```javascript
<script setup>
import { ref } from 'vue'

const arr = ref([1, 2, 3])

// This is NOT reactive
arr.value.push(4)
</script>
```

<seealso>
    <category ref="vue">
        <a href="Vuetify.md" />
    </category>
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
