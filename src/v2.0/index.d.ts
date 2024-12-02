declare module '@opensource-dev/redux-meta' {
  import { Provider } from 'react-redux';
  import { configureStore } from '@reduxjs/toolkit';

  // ReduxMeta Interface
  export interface ReduxMeta {
    Provider: typeof Provider; // Redux Provider
    store: ReturnType<typeof configureStore>; // Redux store instance
    registerModules(modules: ModuleDefinition | ModuleDefinition[]): void; // Register modules method
    getMetaHooks(): MetaHooks; // Hook retrieval method
  }

  // Define a Module
  export interface ModuleDefinition {
    name: string; // Module name
    metaStates: Record<string, any>; // State properties
    metaMutations: Record<string, (state: any, payload: any) => void>; // Reducer functions
    metaActions: Record<
      string,
      (context: ActionContext, payload: any) => any
    >; // Async actions
    metaGetters: Record<string, (state: any, rootState: any) => any>; // Getter functions
  }

  // Context for Actions
  export interface ActionContext {
    state: any; // Local state of the module
    rootState: any; // Global state
    commit: (mutation: string, payload: any) => void; // Commit a mutation
    dispatch: (
      actionInfo: { module: string; action: string },
      payload: any
    ) => void; // Dispatch an action
  }

  // Meta Hooks
  export interface MetaHooks {
    metaStates: (
      moduleName: string,
      states: string[] | Record<string, string>
    ) => Record<string, any>;
    metaMutations: (
      moduleName: string,
      mutations: string[] | Record<string, string>
    ) => Record<string, (payload: any) => void>;
    metaActions: (
      moduleName: string,
      actions: string[] | Record<string, string>
    ) => Record<string, (payload: any) => any>;
  }

  // Export Singleton ReduxMeta
  export const ReduxMeta: ReduxMeta;

  // Export Hook Generator
  export const useMeta: () => MetaHooks;
}
  