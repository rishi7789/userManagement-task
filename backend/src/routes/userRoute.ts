import { Router } from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controller/userController";

const router = Router();

router.get("/get", getUsers);
router.get("/getbyid/:id", getUserById);
router.post("/create", createUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

export default router;
