import { Request, Response, NextFunction } from "express";

let users = [
    {
        id: "1",
        name: "Amit Kumar",
        email: "amit@example.com",
        city: "Bangalore",
        role: "developer",
        createdAt: "2025-01-10T09:00:00Z"
    },
    {
        id: "2",
        name: "Priya Sharma",
        email: "priya@example.com",
        city: "Mumbai",
        role: "designer",
        createdAt: "2025-01-12T14:30:00Z"
    },
    {
        id: "3",
        name: "Rahul Verma",
        email: "rahul@example.com",
        city: "Delhi",
        role: "manager",
        createdAt: "2025-01-15T11:15:00Z"
    }
];

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        status: 200,
        data: users
    });
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return next({ status: 404, message: "User not found" });
    }

    res.status(200).json({
        status: 200,
        data: user
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
    const { name, email, city, role } = req.body;

    if (!name || !email || !city || !role) {
        return next({ status: 400, message: "All fields are required" });
    }

    const newUser = {
        id: (users.length + 1).toString(),
        name,
        email,
        city,
        role,
        createdAt: new Date().toLocaleString()
    };

    users.push(newUser);

    res.status(201).json({
        status: 201,
        message: "User created successfully",
        data: newUser
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const { name, email, city, role } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
        return next({ status: 404, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (city) user.city = city;
    if (role) user.role = role;

    res.status(200).json({
        status: 200,
        data: user
    });
};

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const exists = users.find(u => u.id === userId);
    console.log("exists", exists);

    if (!exists) {
        return next({ status: 404, message: "User not found" });
    }

    users = users.filter(u => u.id !== userId);

    res.status(200).json({
        status: 200,
        message: "User deleted successfully",
        data: users
    });
};
