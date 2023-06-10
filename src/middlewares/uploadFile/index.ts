import path from "path";

import asyncHandler from "../asyncHandler";
import ErrorResponse from "../../utils/errorResponse";
import uploadToStorage, { UploadedFile } from "../../utils/firebase";
import { getPhotoFilePath, validateSize, randomString } from "./utils";

const uploadFile = asyncHandler(async (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next();
  }

  try {
    let uploadedFile: UploadedFile | null = null;

    // TODO: Add file type ~ another file type
    switch (file.fieldname) {
      case "photo":
        uploadedFile = await uploadPhoto(file, getPhotoFilePath(req));
        break;
      case "file":
        uploadedFile = await uploadMessageFile(file);
        break;
    }

    req.body.uploadedFile = uploadedFile;

    next();
  } catch (err) {
    return next(err);
  }
});

const uploadPhoto = async (file: Express.Multer.File, filePath: string) => {
  const size = validateSize("image", file.size, file.fieldname);
  if (size.invalid) {
    throw new ErrorResponse(size.error ?? "Invalid Size", 400);
  }

  if (!file.mimetype.startsWith("image")) {
    throw new ErrorResponse("Invalid file type, only image type", 400);
  }

  const fileName = `${filePath}${path.extname(file.originalname)}`;

  return await uploadToStorage(file, "photos", fileName);
};

const uploadMessageFile = async (file: Express.Multer.File) => {
  const mediaRegex = /^(image|video).*/;

  const mediaType = file.mimetype.substring(0, file.mimetype.indexOf("/"));

  const fileType = mediaRegex.test(file.mimetype) ? mediaType : "file";

  const size = validateSize(fileType, file.size, fileType);
  if (size.invalid) {
    throw new ErrorResponse(size.error ?? "Invalid Size", 400);
  }

  const fileName = `${randomString()}${path.extname(file.originalname)}`;

  return await uploadToStorage(file, "files", fileName);
};

export default uploadFile;
