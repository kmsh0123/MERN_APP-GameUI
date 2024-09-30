import { Router } from "express";
import { createGameRequest, deleteRequestGame, gameRequestList, gameRequestListDetail } from "../controllers/GameRequestController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/admin/game_request_list",isAuthenticated,roleMiddleware(['admin']),gameRequestList)

router.get("/admin/game_request_list_detail/:id",isAuthenticated,roleMiddleware(['admin']),gameRequestListDetail)

router.delete("/admin/game_request_delete/:id",isAuthenticated,roleMiddleware(['admin']),deleteRequestGame)

router.post("/user/game_request",isAuthenticated,roleMiddleware(['user']),createGameRequest)


export default router;