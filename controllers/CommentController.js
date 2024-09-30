import CommentModel from "../models/CommentModel.js";
import ReplyModel from "../models/ReplyModel.js";
import UserModel from "../models/UserModel.js";


export const getCommentID = async (req, res) => {
    const { noteId } = req.params;
    try {
        const comments = await CommentModel.find({ note: noteId })
            .populate({ path: 'user', select: 'name' }) // Populate the user's name for comments
            .populate({
                path: 'replies',
                populate: { path: 'user', select: 'name' } // Populate the user's name for replies
            });

        const commentCount = comments.length; // Get the number of comments for the note

        res.status(200).json({
            success: true,
            comments,
            commentCount // Return the comment count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const comments = await CommentModel.find({})
            .populate({ path: 'user', select: 'name' }) // Populate the user's name for comments
            .populate({
                path: 'replies',
                populate: { path: 'user', select: 'name' } // Populate the user's name for replies
            });

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};
export const createComment = async (req, res) => {

    const { content } = req.body;
    const { noteId } = req.params;  // Note ID from params
    const userId = req.user.userId;

    try {

        const user = await UserModel.findById(userId);
        
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: 'Your account is banned and you cannot create comments.',
            });
        }
        const newComment = new CommentModel({
            user: userId,
            content,
            note: noteId
        });

        await newComment.save();

        const populatedComment = await CommentModel.findById(newComment._id)
            .populate({ path: 'user', select: 'name' });

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment: populatedComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

export const createCommentAdmin = async (req, res) => {
    const { content } = req.body;
    const { noteId } = req.params;  // Note ID from params
    const adminId = req.user.adminId;

    try {
        const newComment = new CommentModel({
            admin: adminId,
            content,
            note: noteId
        });

        await newComment.save();

        const populatedComment = await CommentModel.findById(newComment._id)
            .populate({ path: 'user', select: 'name' });

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment: populatedComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

export const createReply = async (req, res) => {
    const {content} = req.body;
    const {commentId} = req.params;
    const userId = req.user.userId;

    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const newReply = new ReplyModel({
            comment: commentId,
            user: userId,
            content
        });

        await newReply.save();

        const populatedReply = await ReplyModel.findById(newReply._id).populate('user', 'name');

        comment.replies.push(newReply._id);
        await comment.save();

        res.status(201).json({
            success: true,
            message: "Reply created successfully",
            reply: {
                _id: populatedReply._id,
                content: populatedReply.content,
                user: populatedReply.user.name,  // Include the user's name
                createdAt: populatedReply.createdAt,
                updatedAt: populatedReply.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

export const createReplyAdmin = async (req, res) => {
    const {content} = req.body;
    const {commentId} = req.params;
    const adminId = req.user.adminId;

    try {
        const comment = await CommentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        const newReply = new ReplyModel({
            comment: commentId,
            admin: adminId,
            content
        });

        await newReply.save();

        const populatedReply = await ReplyModel.findById(newReply._id).populate('user', 'name');

        comment.replies.push(newReply._id);
        await comment.save();

        res.status(201).json({
            success: true,
            message: "Reply created successfully",
            reply: {
                _id: populatedReply._id,
                content: populatedReply.content,
                admin: populatedReply.admin.name,  // Include the user's name
                createdAt: populatedReply.createdAt,
                updatedAt: populatedReply.updatedAt
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await CommentModel.findByIdAndDelete(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Also delete replies associated with this comment
        await ReplyModel.deleteMany({ comment: commentId });

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};

export const deleteReply = async (req, res) => {
    const { replyId } = req.params;

    try {
        const reply = await ReplyModel.findByIdAndDelete(replyId);

        if (!reply) {
            return res.status(404).json({
                success: false,
                message: "Reply not found"
            });
        }

        // Remove the reply from the associated comment
        await CommentModel.findByIdAndUpdate(reply.comment, {
            $pull: { replies: replyId }
        });

        res.status(200).json({
            success: true,
            message: "Reply deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
};