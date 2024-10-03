'use client';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addToCart, removeFromCart, updateCart } from '@/app/store/cartSlice';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useEffect, useState, useCallback } from 'react';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Loading from '@/components/Loading';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useRouter } from 'next/navigation';
import { setCartItems } from '@/app/store/bookingSlice';

export default function Cart() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { items: cartItems, status } = useSelector((state) => state.cart);
    const [total, setTotal] = useState(0);
    const [selectedItems, setSelectedItems] = useState({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const calculateTotal = useCallback(() => {
        const newTotal = cartItems.reduce((sum, item) => {
            if (selectedItems[item.id]) {
                return sum + item.menuItem.price * item.quantity;
            }
            return sum;
        }, 0);
        setTotal(newTotal);
    }, [cartItems, selectedItems]);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (cartItems) {
            const defaultSelectedItems = cartItems.reduce((acc, item) => {
                acc[item.id] = true;
                return acc;
            }, {});
            setSelectedItems(defaultSelectedItems);
            calculateTotal();
        }
    }, [cartItems, calculateTotal]);

    useEffect(() => {
        calculateTotal();
    }, [cartItems, selectedItems, calculateTotal]);

    const handleRemoveItem = (id) => {
        setItemToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const handleDeleteConfirmed = () => {
        dispatch(removeFromCart(itemToDelete));
        handleCloseDeleteDialog();
    };

    const updateQuantity = (id, newQuantity) => {
        dispatch(updateCart({ itemId: id, quantity: newQuantity }));
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    if (status === 'loading') {
        return <Loading />;
    }

    if (status === 'failed') {
        return <div>Error loading cart. Please try again.</div>;
    }

    const handleConfirm = async () => {
        // Lấy các mục đã chọn trong giỏ hàng
        const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);

        // Chuyển đổi các mục đã chọn thành định dạng mà bạn muốn lưu
        const selectedItemsWithDetails = selectedCartItems.map(item => ({
            id: item.menuItem.id,
            name: item.menuItem.name,
            quantity: item.quantity,
            price: item.menuItem.price,
            total: item.menuItem.price * item.quantity
        }));

        // Gửi dữ liệu vào redux
        dispatch(setCartItems({ selectedItems: selectedItemsWithDetails, total }));

        // Chuyển hướng đến trang thanh toán
        router.push('/payment-cart');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h1>

                {!cartItems || cartItems.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Your cart is empty.</p>
                ) : (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems[item.id] || false}
                                                onChange={() => handleSelectItem(item.id)}
                                                className="accent-orange-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {item.menuItem.images && item.menuItem.images.length > 0 && (
                                                    <div className="flex-shrink-0 h-16 w-16 mr-4">
                                                        <Image
                                                            src={item.menuItem.images[0].url}
                                                            alt={item.menuItem.name}
                                                            width={64}
                                                            height={64}
                                                            className="h-16 w-16 object-cover rounded-md"
                                                        />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.menuItem.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{item.menuItem.price.toLocaleString('en-US')} $</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} className="text-gray-500 hover:text-gray-700" disabled={item.quantity <= 1}>
                                                    <MinusCircle size={20} />
                                                </button>
                                                <span className="text-sm text-gray-900">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} className="text-gray-500 hover:text-gray-700">
                                                    <PlusCircle size={20} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{(item.menuItem.price * item.quantity).toLocaleString('en-US')} $</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleRemoveItem(item.menuItemId)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-6 py-4 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <p className="text-xl font-semibold text-gray-900">Total:</p>
                                <p className="text-2xl font-bold text-orange-600">{total.toLocaleString('en-US')} $</p>
                            </div>
                            <button onClick={handleConfirm} className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                )}
                <DeleteConfirmationDialog
                    isOpen={deleteDialogOpen}
                    onClose={handleCloseDeleteDialog}
                    onConfirm={handleDeleteConfirmed}
                    title="Confirm Delete"
                    description="Are you sure you want to delete this item? This action cannot be undone."
                />
            </main>
            <Footer />
        </div>
    );
}
