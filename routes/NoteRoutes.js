import { Router } from "express"
import { createNote, deleteNote, getAllNotes, getNote, saveToDraft, updateNote } from "../controllers/NoteController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/get",getAllNotes);

router.get("/get/:id",getNote);

router.post("/admin/create",isAuthenticated,roleMiddleware(['admin']),createNote);

router.delete("/admin/delete/:id",isAuthenticated,roleMiddleware(['admin']),deleteNote);

router.put("/admin/update/:id",isAuthenticated,roleMiddleware(['admin']),updateNote);

export default router