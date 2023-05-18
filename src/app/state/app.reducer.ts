// state/app.reducer.ts
import { createReducer, on } from '@ngrx/store';
// import { increment, decrement, reset } from './app.actions';
import { AppState } from './app.state';

const initialState: AppState = {
  boards: [],
  theme: 'light'
};

// export const appReducer = createReducer(
//   initialState,
//   on(increment, state => ({ ...state, counter: state.counter + 1 })),
//   on(decrement, state => ({ ...state, counter: state.counter - 1 })),
//   on(reset, state => ({ ...state, counter: 0 }))
// );

export const appReducer = createReducer(
    initialState
);
