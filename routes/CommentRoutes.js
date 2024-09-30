// CommentRoutes.js
import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { createComment, createCommentAdmin, createReply, createReplyAdmin, deleteComment, deleteReply, getCommentID, getComments } from "../controllers/CommentController.js";

const router = Router();

// User routes
router.get('/comments', getComments);
router.get('/comment/:noteId', getCommentID);
router.post('/comment/:noteId', isAuthenticated, createComment);
router.post('/reply/:commentId', isAuthenticated, createReply);

// Admin routes (only admin can delete comments or replies)
router.post('/admin/comment/:noteId',isAuthenticated,roleMiddleware(['admin']),createCommentAdmin);
router.post('/admin/reply/:commentId',isAuthenticated,roleMiddleware(['admin']),createReplyAdmin);
router.delete('/admin/comment/:commentId', isAuthenticated, roleMiddleware(['admin']), deleteComment);
router.delete('/admin/reply/:replyId', isAuthenticated, roleMiddleware(['admin']), deleteReply);

export default router;
