import { combineReducers, configureStore } from "@reduxjs/toolkit";

import localStorage from "redux-persist/es/storage";
import { selectedServiceSlice } from "./selectedService";
import { serviceDataSlice } from "./serviceData";
import { authSlice, clearRedux, resetProfile } from "./auth/slice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistReducer,
  persistStore,
} from "redux-persist";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { metaSlice } from "./meta/slice";
import { userSlice } from "./users/slice";
import { serviceSlice } from "./service/slice";
import { staffSlice } from "./staff/slice";
import { appointmentSlice } from "./appointment/slice";
import { logout } from "./auth/action";
import { reportSlice } from "./report/slice";
import { attendenceSlice } from "./attendence/slice";
import { multiStoreSlice } from "./multi-store/slice";

const persistConfig = {
  key: "root",
  storage: localStorage,
  // blacklist: ["loader"],
  whitelist: [
    "auth",
    "users",
    "service",
    "staff",
    "appointment",
    "meta",
    "report",
    "multiStore"
  ],
  // Other configuration options can be added here
};

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  selectedService: selectedServiceSlice.reducer,
  serviceData: serviceDataSlice.reducer,
  meta: metaSlice.reducer,
  users: userSlice.reducer,
  service: serviceSlice.reducer,
  staff: staffSlice.reducer,
  appointment: appointmentSlice.reducer,
  report: reportSlice.reducer,
  attendence: attendenceSlice.reducer,
  multiStore: multiStoreSlice.reducer,
});

const appReducer = (state: any, action: any) => {
  if (
    action.type === resetProfile.type ||
    action.type === logout.fulfilled.type ||
    action.type === clearRedux.type
  ) {
    state = undefined; // Reset state to initial state on logout
  }
  return rootReducer(state, action);
};
// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, appReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the Redux persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Create a hook to use with useSelector for type inference
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
