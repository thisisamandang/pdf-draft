import { Router } from "express";
import { login, signup } from "../controllers/userController";
import { signupValidator } from "../middleware/validator";
import { isAuth } from "../middleware/auth";
const router = Router();

router.post("/signup", signupValidator, signup);
router.post("/login", login);
router.get("/allUsers", isAuth, (req, res) => {});

export default router;
