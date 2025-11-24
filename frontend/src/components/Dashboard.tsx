import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

type User = {
    id: number;
    name: string;
    email: string;
    city: string;
    role: string;
};


const Dashboard = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        city: "",
        role: "",
    });
    const [formErrors, setFormErrors] = useState({
        name: "",
        email: "",
        city: "",
        role: "",
    });

    //get users
    const fetchUsers = async () => {
        setError("");
        try {
            const res = await axios.get<User>(`${API_URL}users/get`);
            setUsers(res.data.data);
        } catch (err: any) {
            setError(err.message || "Error fetching users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    //delete
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL}users/delete/${id}`);
            fetchUsers();
        } catch (err: any) {
            alert("Something went wrong");
        }
    };

    //edit clicked
    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            city: user.city,
            role: user.role,
        });
        setFormErrors({ name: "", email: "", city: "", role: "" });
        setShowForm(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    //form validation
    const validateForm = () => {
        const errors: any = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.role) errors.role = "Role is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    //edit and create
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingUser) {
                await axios.put(`${API_URL}users/update/${editingUser.id}`, formData);
                setEditingUser(null);
            } else {
                await axios.post(`${API_URL}users/create`, formData);
            }

            setFormData({ name: "", email: "", city: "", role: "" });
            setShowForm(false);
            fetchUsers();
        } catch (err: any) {
            alert("Something went wrong");
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto relative">
            <h1 className="text-2xl font-bold">User Management</h1>
            <div className="flex justify-end items-center mb-4 mt-5 ">

                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingUser(null);
                        setFormData({ name: "", email: "", city: "", role: "" });
                        setFormErrors({ name: "", email: "", city: "", role: "" });
                    }}
                    className="bg-blue-500 text-white  px-4 py-2 rounded hover:bg-blue-600"
                >
                    New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">City</th>
                            <th className="py-2 px-4 border-b">Role</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="text-center">
                                <td className="py-2 px-4 border-b">{user.name}</td>
                                <td className="py-2 px-4 border-b">{user.email}</td>
                                <td className="py-2 px-4 border-b">{user.city}</td>
                                <td className="py-2 px-4 border-b">{user.role}</td>
                                <td className="py-2 px-4 border-b flex justify-center gap-2">
                                    <button
                                        onClick={() => handleEdit(user)}
                                        className="bg-green-400 px-2 py-1 rounded hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="bg-red-700 px-2 py-1 rounded text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* form modal */}
            {showForm && (
                <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-300 bg-opacity-20">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                        <h2 className="text-xl font-bold mb-4">User Management</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-left">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border px-2 py-1 rounded"
                                />
                                {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-left">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border px-2 py-1 rounded"
                                />
                                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-left">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full border px-2 py-1 rounded"
                                />
                                {formErrors.city && <p className="text-red-500 text-sm">{formErrors.city}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-left">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full border px-2 py-1 rounded"
                                >
                                    <option value="">Select role</option>
                                    <option value="developer">Developer</option>
                                    <option value="designer">Designer</option>
                                    <option value="manager">Manager</option>
                                </select>
                                {formErrors.role && <p className="text-red-500 text-sm">{formErrors.role}</p>}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {editingUser ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
