import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

let instance = null;

class RM {
  constructor() {
    if (instance) return instance; // Singleton pattern
    instance = this;

    this.slice = {};
    this.reducers = {};
    this.actions = {};
    this.getters = {};
    this.store = null;
    this.Provider = Provider;
  }

  registerModules(modules) {
    if (!Array.isArray(modules)) modules = [modules];

    modules.forEach((module) => {
      const { name, metaStates, metaMutations, metaActions, metaGetters } =
        module;

      if (
        !name ||
        !metaStates ||
        !metaMutations ||
        !metaActions ||
        !metaGetters
      ) {
        throw new Error('Invalid module definition');
      }

      // Create Redux slice
      this.slice[name] = createSlice({
        name,
        initialState: metaStates,
        reducers: metaMutations,
      });

      // Register reducers, actions, and getters
      this.reducers[name] = this.slice[name].reducer;
      this.actions[name] = metaActions;
      this.getters[name] = metaGetters;
    });

    // Initialize store (once)
    if (!this.store) {
      // Get all action types dynamically
      const ignoredActions = [];
      Object.keys(this.slice).forEach((moduleName) => {
        Object.keys(this.slice[moduleName].actions).forEach((actionName) => {
          ignoredActions.push(`${moduleName}/${actionName}`);
        });
      });

      this.store = configureStore({
        reducer: combineReducers(this.reducers),
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: { ignoredActions },
          }),
      });
    }
  }

  getMetaHooks() {
    const dispatch = useDispatch();

    return {
      metaStates: (moduleName, states) => {
        const selectedStates = {};
        states.forEach((stateName) => {
          selectedStates[stateName] = useSelector(
            (state) => state[moduleName][stateName]
          );
        });
        return selectedStates;
      },

      metaMutations: (moduleName, mutations) => {
        const boundMutations = {};
        mutations.forEach((mutation) => {
          boundMutations[mutation] = (payload) =>
            dispatch(this.slice[moduleName].actions[mutation](payload));
        });
        return boundMutations;
      },

      metaActions: (moduleName, actions) => {
        const boundActions = {};
        const rootState = useSelector((state) => state); // Get full state for actions
        actions.forEach((action) => {
          boundActions[action] = (payload) =>
            this.actions[moduleName][action](
              {
                state: rootState[moduleName],
                rootState,
                commit: (mutation, data) =>
                  dispatch(this.slice[moduleName].actions[mutation](data)),
                dispatch: (actionInfo, args) =>
                  this.actions[actionInfo.module][actionInfo.action](args),
              },
              payload
            );
        });
        return boundActions;
      },
    };
  }
}

// Export the singleton instance
const ReduxMeta = new RM();

// Export the useMeta function
const useMeta = () => ReduxMeta.getMetaHooks();

export { ReduxMeta, useMeta };