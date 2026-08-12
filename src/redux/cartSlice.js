import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // ================= ADD TO CART =================
    addToCart: (state, action) => {
      const item = action.payload;

      // Same menu + same extras + same instructions
      // = same cart item
      const existingItem = state.items.find(
        (cartItem) =>
          cartItem.cartItemId === item.cartItemId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...item,
          quantity: 1,
        });
      }
    },

    // ================= INCREASE QUANTITY =================
    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (cartItem) =>
          cartItem.cartItemId === action.payload
      );

      if (item) {
        item.quantity += 1;
      }
    },

    // ================= DECREASE QUANTITY =================
    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (cartItem) =>
          cartItem.cartItemId === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    // ================= REMOVE ITEM =================
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (cartItem) =>
          cartItem.cartItemId !== action.payload
      );
    },

    // ================= CLEAR CART =================
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;