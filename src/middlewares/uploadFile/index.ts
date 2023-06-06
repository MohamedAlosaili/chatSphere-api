import path from "path";

import asyncHandler from "../asyncHandler";
import ErrorResponse from "../../utils/errorResponse";
import uploadToStorage, { UploadedFile } from "../../utils/firebase";
import { validateSize } from "./validation";
import { User } from "../../models/User";

const uploadFile = asyncHandler(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new ErrorResponse("Invalid/Missing file", 400));
  }

  try {
    let uploadedFile: UploadedFile | null = null;

    // TODO: Add media type ~ another file type
    switch (file.fieldname) {
      case "photo":
        uploadedFile = await uploadPhoto(file, req.user as User);
        break;
    }

    req.body.uploadedFile = uploadedFile;

    next();
  } catch (err) {
    return next(err);
  }
});

const uploadPhoto = async (file: Express.Multer.File, user: User) => {
  const size = validateSize("image", file.size, file.fieldname);
  if (size.invalid) {
    throw new ErrorResponse(size.error ?? "Invalid Size", 400);
  }

  if (!file.mimetype.startsWith("image")) {
    throw new ErrorResponse("Invalid file type, only image type", 400);
  }

  const fileName = `${user._id}${path.extname(file.originalname)}`;

  return await uploadToStorage(file, "photos", fileName);
};

export default uploadFile;
