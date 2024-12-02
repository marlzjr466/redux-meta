
# Redux Meta

**ReduxMeta** is a utility library that extends Redux Toolkit to provide a modular state management system inspired by Vuex. It simplifies managing slices, actions, and state selectors, offering a clean API for building scalable and maintainable React applications.

## Features

- **Modular Architecture**: Define modules with `metaStates`, `metaMutations`, `metaActions`, and `metaGetters` for better state organization.

- **Dynamic Store Setup**: Automatically configures a Redux store with combined reducers and middleware.

- **Custom Hooks API**: Access state (`metaStates`), mutations (`metaMutations`), and actions (`metaActions`) effortlessly using `useMeta`.

- **Vuex-Like Workflow**: Integrates concepts like `commit`, `dispatch`, and `rootState` for a familiar and intuitive experience.

---

## Getting Started

Follow these steps to integrate `ReduxMeta` into your project:

### Installation

Install the library via npm:

```bash
npm install @opensource-dev/redux-meta
```

Or using Yarn:

```bash
yarn add @opensource-dev/redux-meta
```

---

## Basic Usage

### Setting Up ReduxMeta Provider

Wrap your application with the `ReduxMeta.Provider` component and pass the `ReduxMeta.store` as a prop to enable the registered modules.

```jsx
import { ReduxMeta } from '@opensource-dev/redux-meta';

export default function App() {
  return (
    <ReduxMeta.Provider store={ReduxMeta.store}>
      {/* Your application components */}
    </ReduxMeta.Provider>
  );
}
```

### Defining Modules

A module is an object defining the state (`metaStates`), mutations (`metaMutations`), actions (`metaActions`), and getters (`metaGetters`) for a feature. Here's an example:

```javascript
export default () => ({
  metaModule: true,
  name: 'user',

  metaStates: {
    name: '',
    address: '',
    gender: '',
  },

  metaMutations: {
    SET_NAME: (state, { payload }) => {
      state.name = payload;
    },
  },

  metaGetters: {
    gender: (state) => state.gender,
  },

  metaActions: {
    getUser({ commit }, params) {
      const name = 'John Doe';
      commit('SET_NAME', name);

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
    },
  },
});
```

### Registering Modules

Modules can be registered individually or in bulk:

```javascript
import user from './modules/user';
import work from './modules/work';

// Register a single module
ReduxMeta.registerModules(user());

// Register multiple modules
ReduxMeta.registerModules([user(), work()]);
```

### Using `useMeta`

The `useMeta` hook provides access to the module's state, mutations, getters, and actions.

```javascript
import { useMeta } from '@opensource-dev/redux-meta';

export default function UserComponent() {
  const { metaStates, metaMutations, metaActions } = useMeta();

  const user = metaStates('user', ['name', 'address']);
  const actions = metaActions('user', ['getUser']);

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Address: {user.address}</p>
      <button onClick={() => actions.getUser()}>Fetch User</button>
    </div>
  );
}
```

---

## Module API Reference

| Property       | Type     | Required | Description                           |
|----------------|----------|----------|---------------------------------------|
| `metaModule`   | Boolean  | ✅        | Indicator for ReduxMeta module.       |
| `name`         | String   | ✅        | Unique name of the module.            |
| `metaStates`   | Object   | ✅        | Initial state definitions.            |
| `metaMutations`| Object   | ❌        | State mutation functions.             |
| `metaGetters`  | Object   | ❌        | Read-only computed properties.        |
| `metaActions`  | Object   | ❌        | Async or cross-module actions.        |

---

## Advanced Usage

### State Aliases

Create aliases for state properties to simplify usage:

```javascript
const user = metaStates('user', {
  userName: 'name',
  userAddress: 'address',
});
console.log(user.userName, user.userAddress);
```

### Multiple Modules

Access state, mutations, and actions across multiple modules:

```javascript
const meta = metaStates({
  userName: 'user/name',
  companyName: 'work/name',
});

console.log(meta.userName, meta.companyName);
```

---

## Example Application

Here's an example combining multiple features:

```jsx
import { useMeta } from '@opensource-dev/redux-meta';

export default function UserWorkComponent() {
  const { metaStates, metaActions } = useMeta();

  const meta = {
    ...metaStates('user', { userName: 'name' }),
    ...metaStates('work', { companyName: 'name' }),
  };

  const actions = metaActions('user', ['getUser']);

  return (
    <div>
      <p>Hi, I'm {meta.userName}.</p>
      <p>I work at {meta.companyName}.</p>
      <button onClick={() => actions.getUser()}>Fetch User</button>
    </div>
  );
}
```