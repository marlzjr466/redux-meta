import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

class ReduxMeta {
  constructor () {
    this.slice = {}
    this.reducers = {}
    this.actions = {}
    this.getters = {}
    this.store = null
  }

  useModules (modules) {
    if (!Array.isArray(modules)) {
      modules = [modules]
    }
    
    for (const module of modules) {
      const { metaModule, name, metaStates, metaMutations, metaActions, metaGetters } = module
      

      if (!metaModule) {
        throw new Error('Invalid redux meta module')
      }

      if (!name) {
        throw new Error('Missing name of module')
      }

      if (!metaStates || !metaMutations || !metaActions || !metaGetters) {
        throw new Error('Missing meta inside the module')
      }

      // create slice
      this.slice[name] = createSlice({
        name,
        initialState: metaStates,
        reducers: metaMutations
      })

      // use to track all registered reducers
      this.reducers[name] = this.slice[name].reducer

      // track all actions
      this.actions[name] = metaActions

      // track all getters
      this.getters[name] = metaGetters
    }

    // initialize store
    this.store = configureStore({
      reducer: combineReducers(this.reducers)
    })
  }

  useMeta () {
    const slice = this.slice
    const actions = this.actions
    const getters = this.getters

    return {
      // init mapStates
      metaStates (moduleName, states) {
        const returnStates = {}

        // multiple aliases at once
        if (typeof moduleName === 'object') {
          const obj = moduleName

          for (const alias in obj) {
            const [module, stateName] = obj[alias].split('/')

            returnStates[alias] = useSelector(state => state[module][stateName])
          }

          return returnStates
        }
      
        // aliases
        if (!Array.isArray(states)) {
          for (const key in states) {
            returnStates[key] = useSelector(state => state[moduleName][states[key]])
          }
      
          return returnStates
        }
        
        for (const item of states) {
          returnStates[item] = useSelector(state => state[moduleName][item])
        }
      
        return returnStates
      },

      // init mutations
      metaMutations (moduleName, fns) {
        const dispatch = useDispatch()
        const returnMutations = {}

        // multiple aliases at once
        if (typeof moduleName === 'object') {
          const obj = moduleName

          for (const alias in obj) {
            const [module, mutationName] = obj[alias].split('/')

            returnMutations[alias] = state => {
              dispatch(slice[module].actions[mutationName](state))
            }
          }

          return returnMutations
        }

        // aliases
        if (!Array.isArray(fns)) {
          for (const key in fns) {
            returnMutations[key] = state => {
              dispatch(slice[moduleName].actions[fns[key]](state))
            }
          }

          return returnMutations
        }

        for (const fn of fns) {
          returnMutations[fn] = state => {
            dispatch(slice[moduleName].actions[fn](state))
          }
        }

        return returnMutations
      },

      // init getters
      metaGetters (moduleName, gtrs) {
        const returnGetters = {}
        const state = useSelector(state => state[moduleName])

        // multiple aliases at once
        if (typeof moduleName === 'object') {
          const obj = moduleName

          for (const alias in obj) {
            const [module, getterName] = obj[alias].split('/')

            const activeState = useSelector(state => state[module])
            returnGetters[alias] = getters[module][getterName](activeState)
          }

          return returnGetters
        }

        // aliases
        if (!Array.isArray(gtrs)) {
          for (const key in gtrs) {
            returnGetters[key] = getters[moduleName][gtrs[key]](state)
          }

          return returnGetters
        }

        for (const getter of gtrs) {
          returnGetters[getter] = getters[moduleName][getter](state)
        }
      
        return returnGetters
      },

      // init actions
      metaActions (moduleName, fns) {
        const dispatch = useDispatch()
        const returnActions = {}

        const modules = Object.keys(slice)
        let rootState = {}
        const state = useSelector(state => state[moduleName])

        for (const module of modules) {
          rootState[module] = useSelector(state => state[module])
        }
        
        // commit data to mutation
        function commit (mutation, data) {
          dispatch(slice[moduleName].actions[mutation](data))
        }

        // call mapActions function here
        function callDispatch ({ module = moduleName, action }, args) {
          actions[module][action]({ commit, rootState, state: rootState[module], dispatch: callDispatch }, args)
        }

        // multiple aliases at once
        if (typeof moduleName === 'object') {
          const obj = moduleName

          for (const alias in obj) {
            const [actionModule, actionName] = obj[alias].split('/')

            // commit data to mutation
            function commitAlias (mutation, data) {
              dispatch(slice[actionModule].actions[mutation](data))
            }

            // call mapActions function here
            function callDispatchAlias ({ module = moduleName, action }, args) {
              actions[module][action]({ commit: commitAlias, rootState, state: rootState[module], dispatch: callDispatchAlias }, args)
            }

            returnActions[alias] = data => {
              return actions[actionModule][actionName]({ commit: commitAlias, rootState, state, dispatch: callDispatchAlias }, data)
            }
          }

          return returnActions
        }

        // aliases
        if (!Array.isArray(fns)) {
          for (const key in fns) {
            returnActions[key] = data => {
              return actions[moduleName][fns[key]]({ commit, rootState, state, dispatch: callDispatch }, data)
            }
          }

          return returnActions
        }

        for (const fn of fns) {
          returnActions[fn] = data => {
            return actions[moduleName][fn]({ commit, rootState, state, dispatch: callDispatch }, data)
          }
        }
      
        return returnActions
      }
    }
  }
}

const ReduxMetaProvider = Provider
export {
  ReduxMeta,
  ReduxMetaProvider
}