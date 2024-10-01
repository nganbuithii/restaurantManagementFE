import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API, { authApi, endpoints } from '@/app/configs/API';
import { updateCartTotalItems } from './authSlice';

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const token = getState().auth.token; 
        try {
            const response = await authApi(token).get(endpoints.getCart)
            console.log("Cart items từ API:", response.data.data.cart.items);
            return response.data.data.cart.items; 
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ menuItemId, quantity }, { getState, dispatch, rejectWithValue }) => {
        const token = getState().auth.token; 
        try {
            const response = await authApi(token).post(endpoints.addCart, {
                menuItemId,
                quantity,
            });
            console.log("Thêm món vào giỏ thành công")
            console.log("total", response.data.data.totalItems)
            dispatch(updateCartTotalItems(response.data.data.totalItems))
            return response.data.data.cart.items; 
        } catch (error) {
            console.log("lỗi cart")
            return rejectWithValue(error.response.data); 
        }
    }
);
export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async ({ itemId, quantity }, { getState, dispatch, rejectWithValue }) => {
        const token = getState().auth.token; 
        try {
            const response = await authApi(token).patch(endpoints.getCart, {
                itemId,
                quantity,
            });
            console.log("Cập nhật giỏ hàng thành công");
            dispatch(updateCartTotalItems(response.data.data.totalItems)); 
            return response.data.data.cart.items; 
        } catch (error) {
            console.error("Chi tiết lỗi khi cập nhật giỏ hàng:", error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { getState, dispatch, rejectWithValue }) => {
        const token = getState().auth.token;
        try {
            console.log("id xóa", itemId)
            const response = await authApi(token).delete(endpoints.removeCart(itemId));
            console.log("Xóa món khỏi giỏ thành công");
            dispatch(updateCartTotalItems(response.data.data.totalItems));
            return response.data.data.cart.items;
        } catch (error) {
            console.error("Chi tiết lỗi khi xóa khỏi giỏ hàng:", error.response);
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearCart: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFromCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;