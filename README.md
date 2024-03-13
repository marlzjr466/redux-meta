# Redux Meta

> A state handler for react and react native using `react-redux` and `@reduxjs/toolkit`

## Getting Started

These instructions will help you implement on how to use the `redux-meta`

## Installation

Start with installing @reduxjs/toolkit and react-redux to be use by the package:

```sh
$ npm install @reduxjs/toolkit react-redux
```

Or if you prefer using Yarn:

```sh
$ yarn add @reduxjs/toolkit react-redux
```

To install the package:

```sh
$ npm install @opensource-dev/redux-meta
```

Or using Yarn:

```sh
$ yarn add @opensource-dev/redux-meta
```

## Usage

### ReduxMeta

Note: reduxMeta should be initialize once in your root file and pass it as a prop or initialize it globally
```js
import { ReduxMeta } from '@opensource-dev/redux-meta'

const reduxMeta = new ReduxMeta()
// Note: pass reduxMeta as props from your root component
// or initialize globally
// react native
// global.reduxMeta = new ReduxMeta()

// react
// window.reduxMeta = new ReduxMeta()
```

### ReduxMetaProvider

In your main.js/jsx for react and App.js for react native, wrap your component with ReduxMetaProvider to enable the registered modules.

```js
import { ReduxMetaProvider } from '@opensource-dev/redux-meta'

// react native (App.js)
export default function App() {
  return (
    <ReDuxMetaProvider>
      <View reduxMeta={reduxMeta}>
        {/* Components here.. */}
      </View>
    </ReDuxMetaProvider>  
  )
}

// react (main.js/jsx)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ReDuxMetaProvider>
      <App reduxMeta={reduxMeta} />
    </ReDuxMetaProvider>
  </React.StrictMode>,
)
```

#### Modules

Modules can be an object or an array to register multiple modules at once. 

`metaModule`

| Type | Required | Description |
| --- | --- | --- |
| boolean | true | Redux meta module |


`name`

| Type | Required | Description |
| --- | --- | --- |
| string | true | Name of the module |


`metaStates`

| Type | Required | Description |
| --- | --- | --- |
| object | true | States will be initialize here |


`metaMutations`

| Type | Required | Description |
| --- | --- | --- |
| object | true | Inside this are the functions that will mutate the states |


`metaActions`

| Type | Required | Description |
| --- | --- | --- |
| object | true | Inside this are the functions that will interact with metaMutations |


Module example (user.js):

```js
export default () => {
  // return the module here
  return {
    metaModule: true,
    name: 'user',

    metaStates: {
      name: '',
      address: ''
    },

    metaMutations: {
      SET_NAME: (state, { payload }) => {
        state.name = payload
      }
    },

    metaActions: {
      getUser ({ commit }, params) {
        const name = 'John Doe'
        
        commit('SET_NAME', name)
      }
    }
  }
}
```

#### Hooks

`useModules`

Function that will register all the modules. Example using the user module.

```js
const reduxMeta = new ReduxMeta()

// register module
reduxMeta.useModules(user)

// register multiple modules (user, work, ...)
reduxMeta.useModules([
  user,
  work
])
```

`useMeta`

This will return metaStates, metaMutations and metaActions functions. All functions has two arguments needed, the module name and the name of states, mutations or actions, it can be an array or an object to create aliases for the names.

Example using the User module:

metaStates

```js
const user = metaStates('user', [
  'name',
  'address'
])

// use
console.log(user.name, user.address)
```

Or initialize with aliases

```js
const info = metaStates('user', {
  name: 'user_name',
  address: 'user_address'
})

// use
console.log(info.user_name, info.user_address)
```

metaMutations

```js
const user = metaMutations('user', [
  'SET_NAME'
])

// use
user.SET_NAME('John Doe')
```

Or initialize with aliases

```js
const user = metaMutations('user', {
  SET_NAME: 'setName'
})

// use
user.setName('John Doe')
```

metaActions

```js
const user = metaActions('user', [
  'getUser'
])

// use
user.getUser()
```

Or initialize with aliases

```js
const user = metaActions('user', {
  getUser: 'get_user'
})

// use
user.get_user()
```

Example in User|Work:

```js
function User ({ reduxMeta }) {
  const { metaStates, metaMutations, metaActions } = reduxMeta.useMeta()
  // or using global.reduxMeta.useMeta() | window.reduxMeta.useMeta()

  // init meta
  const meta = {
    ...metaStates('user', {
      name: 'user_name'
    }),

    ...metaStates('work', {
      name: 'company_name'
    })

    // initialize below the metaMutations and metaActions if needed
  }

  return (
    <View>
      <Text>Hi, I'm { meta.user_name }.</Text>
      <Text>I'm currently working here in { meta.company_name }.</Text>
    </View>
  )
}
```