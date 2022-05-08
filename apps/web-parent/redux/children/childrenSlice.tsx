import { UserChild } from '@lib/types/interfaces';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChildrenState {
  value: UserChild[];
}

const initialState: ChildrenState = {
  value: [],
};

export const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setChildren: (state, action: PayloadAction<UserChild[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setChildren } = childrenSlice.actions;

export default childrenSlice.reducer;
