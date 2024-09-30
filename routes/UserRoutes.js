import { Router } from "express";
import {roleMiddleware} from "../middleware/roleMiddleware.js";
import { registerAdmin, getAllUsers, loginAdmin, registerUser, loginUser, logoutAdmin, logoutUser, banUser, unbanUser, getSingleUser } from "../controllers/UserController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = Router();

// Protected route for admin registration (only accessible by admins)
router.post('/admin/register',isAuthenticated,registerAdmin);

router.post("/admin/login",loginAdmin)

router.post("/admin/logout",isAuthenticated, roleMiddleware(['admin']),logoutAdmin)

router.get('/admin/getUsers',isAuthenticated, roleMiddleware(['admin']), getAllUsers);

router.get('/admin/getSingle/:id',isAuthenticated, roleMiddleware(['admin']), getSingleUser);

router.patch('/admin/ban/:userId', isAuthenticated, roleMiddleware(['admin']), banUser);

router.patch('/admin/unban/:userId', isAuthenticated, roleMiddleware(['admin']), unbanUser);

// Public route for user registration
router.post('/user/register',registerUser);

router.post('/user/login',loginUser);

router.post('/user/logout',isAuthenticated,logoutUser);

export default router;
