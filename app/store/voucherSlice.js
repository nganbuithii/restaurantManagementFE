import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API, { authApi, endpoints } from '@/app/configs/API';

export const saveVoucherForCustomer = createAsyncThunk(
    'vouchers/saveVoucherForCustomer',
    async (voucherId, { rejectWithValue, getState }) => {
        try {
            const { auth } = getState();
            const response = await authApi(auth.token).post(endpoints.saveVoucher(voucherId));
            return response.data.data;  // Trả về dữ liệu voucher từ API
        } catch (error) {
            console.log("Lỗi backend trả về: ", error.response?.data || "Error saving voucher"); // In ra lỗi backend
            return rejectWithValue(error.response?.data || "Error saving voucher");
        }
    }
);

const voucherSlice = createSlice({
    name: 'vouchers',
    initialState: {
        allVouchers: [],
        currentPage: 1,
        totalPages: 0,
        isLoading: false,
        hasMore: true,
        savingVoucher: false,
        saveError: null,
        customerVouchers: [],  // Khởi tạo mảng rỗng cho customerVouchers
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Xử lý trạng thái đang lưu voucher
            .addCase(saveVoucherForCustomer.pending, (state) => {
                state.savingVoucher = true;
                state.saveError = null;
            })
            // Xử lý khi lưu voucher thành công
            .addCase(saveVoucherForCustomer.fulfilled, (state, action) => {
                state.savingVoucher = false;
                
                // Đảm bảo customerVouchers là một mảng trước khi gọi push
                if (!Array.isArray(state.customerVouchers)) {
                    state.customerVouchers = [];
                }
                state.customerVouchers.push(action.payload);  // Thêm dữ liệu voucher mới vào mảng
                
                // Cập nhật trạng thái của voucher trong allVouchers
                const index = state.allVouchers.findIndex(v => v.id === action.payload.voucherId);
                if (index !== -1) {
                    state.allVouchers[index] = {
                        ...state.allVouchers[index],
                        isSaved: true  // Đánh dấu voucher là đã lưu
                    };
                }
            })
            // Xử lý khi lưu voucher thất bại
            .addCase(saveVoucherForCustomer.rejected, (state, action) => {
                state.savingVoucher = false;
                state.saveError = action.payload;  // Lưu lỗi để hiển thị cho người dùng
            });
    },
});

export default voucherSlice.reducer;
