import { createContext } from 'react';

const defaultAppState = {
  workers: [],
  FollowSupervisorForm: {
    helperText: {},
    supervisor: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    contactPref: '',
    isSubmitting: false,
    success: false,
  },
};

const appStateReducer = (state, action) => {
  const { type, component, worker, key, value } = action;
  switch (type) {
    case 'set':
      // Set the value of a key explicitly. Use {type, component, key, value}
      return { ...state, [component]: { ...state[component], [key]: value } };
    case 'toggle':
      // Toggle a boolean key. Use {type, component, key}
      return {
        ...state,
        [component]: { ...state[component], [key]: !state[component][key] },
      };
    case 'reset':
      // Reset a component tree to the default state. Use {type, component}
      return { ...state, [component]: { ...defaultAppState[component] } };
    case 'start':
      // Start a worker. Use {type, worker}
      return { ...state, workers: [...state.workers, worker] };
    case 'end':
      // End a worker. Use {type, worker}
      return {
        ...state,
        workers: state.workers.reduce(
          (filtered, targetWorker) =>
            targetWorker === worker ? filtered : [...filtered, worker],
          []
        ),
      };
    default:
      return state;
  }
};

const AppContext = createContext(null);
export { AppContext, defaultAppState, appStateReducer };
