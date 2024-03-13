import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'

var store = null
export class ReduxMeta {
  constructor () {
    this.slice = {}
    this.reducers = {}
    this.actions = {}
  }

  useModules (modules) {
    if (!Array.isArray(modules)) {
      modules = [modules]
    }
    
    for (const module of modules) {
      const { metaModule, name, metaStates, metaMutations, metaActions } = module
      

      if (!metaModule) {
        throw new Error('Invalid redux meta module')
      }

      if (!name) {
        throw new Error('Missing name of module')
      }

      if (!metaStates || !metaMutations || !metaActions) {
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
    }

    // initialize store
    store = configureStore({
      reducer: combineReducers(this.reducers)
    })
  }

  useMeta () {
    const slice = this.slice
    const actions = this.actions

    return {
      // init mapStates
      metaStates (moduleName, states) {
        const returnStates = {}
      
        // aliases
        if (!Array.isArray(states)) {
          for (const key in states) {
            returnStates[states[key]] = useSelector(state => state[moduleName][key])
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

        // aliases
        if (!Array.isArray(fns)) {
          for (const key in fns) {
            returnMutations[fns[key]] = state => {
              dispatch(slice[moduleName].actions[key](state))
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

      // init actions
      metaActions (moduleName, fns) {
        const dispatch = useDispatch()
        const returnActions = {}

        // commit data to mutation
        function commit (mutation, data) {
          dispatch(slice[moduleName].actions[mutation](data))
        }

        // aliases
        if (!Array.isArray(fns)) {
          for (const key in fns) {
            returnActions[fns[key]] = data => {
              return actions[moduleName][key]({ commit }, data)
            }
          }

          return returnActions
        }

        for (const fn of fns) {
          returnActions[fn] = data => {
            return actions[moduleName][fn]({ commit }, data)
          }
        }
      
        return returnActions
      }
    }
  }
}

export function ReDuxMetaProvider ({ children }) {
  return (
    <Provider store={store}>
      { children }
    </Provider>
  )
}