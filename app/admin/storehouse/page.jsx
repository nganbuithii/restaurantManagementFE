'use client'
import { useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import HeaderAdmin from "@/components/header-admin";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { FaPlus } from "react-icons/fa";

const initialProducts = [
    { id: 1, name: "Sản phẩm A", quantity: 10, price: 50000 },
    { id: 2, name: "Sản phẩm B", quantity: 20, price: 75000 },
    // Thêm dữ liệu giả lập ở đây
];

export default function Storehouse() {
    const labels = ["Trang chủ", "Quản lý kho"];
    const links = ["/admin/dashboard", "/admin/storehouse"];

    const [products, setProducts] = useState(initialProducts);
    const [newProduct, setNewProduct] = useState({ name: "", quantity: 0, price: 0 });

    const handleAddProduct = () => {
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        setProducts([...products, { id: newId, ...newProduct }]);
        setNewProduct({ name: "", quantity: 0, price: 0 });
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 flex flex-col">
                <HeaderAdmin />
                <main className="ml-64 flex-1 p-6 bg-gray-50">
                    <Breadcrumbs labels={labels} links={links} />
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">Quản lý kho</h1>
                        <Button
                            onClick={() => alert("Mở modal thêm sản phẩm")}
                            className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-md"
                        >
                            <FaPlus className="mr-2" />
                            Thêm sản phẩm
                        </Button>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex flex-col mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh sách sản phẩm</h2>
                            <Table>
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-3 px-4 text-left">ID</th>
                                        <th className="py-3 px-4 text-left">Tên sản phẩm</th>
                                        <th className="py-3 px-4 text-left">Số lượng</th>
                                        <th className="py-3 px-4 text-left">Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-t">
                                            <td className="py-3 px-4">{product.id}</td>
                                            <td className="py-3 px-4">{product.name}</td>
                                            <td className="py-3 px-4">{product.quantity}</td>
                                            <td className="py-3 px-4">{product.price.toLocaleString()} VND</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thêm sản phẩm mới</h2>
                            <div className="flex flex-col space-y-4">
                                <Input
                                    placeholder="Tên sản phẩm"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Input
                                    type="number"
                                    placeholder="Số lượng"
                                    value={newProduct.quantity}
                                    onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Input
                                    type="number"
                                    placeholder="Giá"
                                    value={newProduct.price}
                                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button 
                                    onClick={handleAddProduct} 
                                    className="bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-md"
                                >
                                    Thêm sản phẩm
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
