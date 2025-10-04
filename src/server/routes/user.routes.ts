/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response, Router } from "express";
import { User, IUser } from "../models/User";
import { authMiddleware } from "../middleware/authMiddleware";
import bcrypt from "bcrypt";
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`);
  },
});
const upload = multer({ storage });

const router: Router = express.Router();

// שליפת משתמש מחוב־token

interface MulterRequest extends Request {
  file: Express.Multer.File;
}
router.get(
  "/me",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const user = await User.findById(userId).select("-password");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// שליפה לפי ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id)
      .select(
        "firstName lastName email phone role schoolId schoolName assignedClasses extraTime avatar"
      )
      .lean<IUser>();

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("❌ Server error in /users/:id:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// עדכון שדות בפרופיל לפי ID
router.patch("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// שליפת כיתות משויכות למורה
router.get(
  "/:id/classes",
  async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id).select(
        "role assignedClasses"
      );

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      if (user.role !== "teacher") {
        res
          .status(403)
          .json({ success: false, message: "User is not a teacher" });
        return;
      }

      res.json({ success: true, classes: user.assignedClasses || [] });
    } catch (error) {
      console.error("❌ Error fetching assigned classes:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// שליפת פרופיל לפי ID
router.get(
  "/profiles/:id",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id)
        .select(
          "firstName lastName email phone role schoolId schoolName assignedClasses extraTime avatar"
        )
        .lean<IUser>();

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// העלאת תמונת פרופיל
router.put(
  "/me/profile-image",
  authMiddleware,
  upload.single("image"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      const r = req as MulterRequest;
      if (!r.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { avatar: imageUrl },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ imageUrl });
    } catch (error) {
      console.error("❌ Error uploading profile image:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/me",
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const updateData = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json(updatedUser);
    } catch (error) {
      console.error("❌ Error updating current user:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export { router as userRouter };
