# Redux Meta

> A state handler for react and react native, this package is just like `vuex`.

## Getting Started

These instructions will help you implement on how to use `redux-meta`.

## Installation

```sh
$ npm install @opensource-dev/redux-meta
```

Or using Yarn:

```sh
$ yarn add @opensource-dev/redux-meta
```

## Usage

### ReduxMeta

Note: reduxMeta should be initialize once in your root file and pass it as a prop or initialize it globally.
```js
import { ReduxMeta } from '@opensource-dev/redux-meta'

// Note: pass reduxMeta as props from your root component
const reduxMeta = new ReduxMeta()

// or initialize globally

// react native
global.reduxMeta = new ReduxMeta()

// react
window.reduxMeta = new ReduxMeta()
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

### Modules

Modules can be an object or an array to register multiple modules at once. 

`metaModule`

| Type | Required | Description |
| --- | --- | --- |
| boolean | true | Redux meta module (value must be always true) |


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
| object | false | Functions that will mutate the states |


`metaGetters`

| Type | Required | Description |
| --- | --- | --- |
| object | false | a read-only data |


`metaActions`

| Type | Required | Description |
| --- | --- | --- |
| object | false | Functions that will interact with metaMutations |


Module example (user.js):

```js
export default () => {
  // return the module here
  return {
    metaModule: true,
    name: 'user',

    metaStates: {
      name: '',
      address: '',
      gender: ''
    },

    metaMutations: {
      SET_NAME: (state, { payload }) => {
        state.name = payload
      }
    },

    metaGetters: {
      gender: (state) => {
        return state.user.gender
      }
    },

    metaActions: {
      getUser ({ commit, state, rootState, dispatch }, params) {
        const name = 'John Doe'
        
        // commit function will mutate the state in mutations
        commit('SET_NAME', name)

        /*
         * Note:
         * `state`     - are all state stored within the module
         * `rootState` - are all states registered in every module
         * `dispatch`  - is a function that can execute actions that registerd in every module
         *               it has an two arguments: 
         *                - Object { module, action }
         *                - data (any type)
         * 
         * examples:
         * `state.name, state.address`
         * `rootState.user.name or rootState.work.name`
         * `dispatch({ module: 'user', action: 'getUser' }, data)
         */
      }
    }
  }
}
```

### Hooks

`useModules`

Function that will register all the modules. Example using the user module.

```js
const reduxMeta = new ReduxMeta()

// modules
import user from './modules/user'
import work from './modules/work'

// register module
reduxMeta.useModules(user())

// register multiple modules (user, work, ...)
reduxMeta.useModules([
  user(),
  work()
])
```

`useMeta`

This will return metaStates, metaMutations, metaGetters and metaActions functions. All functions has two arguments needed, the module name and the name of states, mutations, getters or actions, it can be an array or an object to create aliases for the names.

Example using the User module:

 - metaStates

```js
const user = metaStates('user', [
  'name',
  'address'
])

// use
console.log(user.name, user.address)


// Or initialize with aliases
const info = metaStates('user', {
  user_name: 'name',
  user_address: 'address'
})

// use
console.log(info.user_name, info.user_address)


// multiple modules with aliases at once
const meta = metaStates({
  // user
  user_name: 'user/name',
  user_address: 'user/address'

  // work
  company_name: 'work/name'
  company_address: 'work/address'
})

// use
console.log(meta.user_name, meta.company_address)
```

 - metaMutations

```js
const user = metaMutations('user', [
  'SET_NAME'
])

// use
user.SET_NAME('John Doe')


// Or initialize with aliases
const user = metaMutations('user', {
  setName: 'SET_NAME'
})

// use
user.setName('John Doe')


// multiple modules with aliases at once
const meta = metaMutations({
  // user
  setName: 'user/SET_NAME',

  // work
  setCompanyName: 'work/SET_COMPANY_NAME'
})

// use
meta.setName('John Doe')
meta.setCompanyName('Company name')
```

 - metaGetters

```js
const user = metaGetters('user', [
  'gender'
])

// use
console.log(user.gender)


//Or initialize with aliases
const user = metaGetters('user', {
  user_gender: 'gender'
})

// use
console.log(user.user_gender)


// multiple modules with aliases at once
const meta = metaGetters({
  // user
  user_gender: 'user/gender',

  // work
  user_company_name: 'work/userCompanyName'
})

// use
console.log(meta.user_gender, meta.user_company_name)
```

 - metaActions

```js
const user = metaActions('user', [
  'getUser'
])

// use
user.getUser()


// Or initialize with aliases
const user = metaActions('user', {
  get_user: 'getUser'
})

// use
user.get_user()


// multiple modules with aliases at once
const meta = metaGetters({
  // user
  getUser: 'user/getUser',

  // work
  getCompany: 'work/getCompany'
})

// use
meta.getUser()
meta.getCompany()
```

Example in User and Work module:

```js
function User ({ reduxMeta }) {
  const { metaStates, metaMutations, metaGetters, metaActions } = reduxMeta.useMeta()
  // or using global.reduxMeta.useMeta() or window.reduxMeta.useMeta()

  // init meta
  const meta = {
    ...metaStates('user', {
      user_name: 'name'
    }),

    ...metaStates('work', {
      company_name: 'name'
    })

    // initialize below the metaMutations, metaGetters and metaActions if needed
  }

  return (
    <View>
      <Text>Hi, I'm { meta.user_name }.</Text>
      <Text>I'm currently working here in { meta.company_name }.</Text>
    </View>
  )
}
```