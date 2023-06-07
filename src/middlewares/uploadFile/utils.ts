import crypto from "crypto";

// Types
import { Req } from "../../types";

// If new file type were added, Add them here
if (
  !process.env.MAX_PHOTO_SIZE ||
  !process.env.MAX_IMAGE_SIZE ||
  !process.env.MAX_VIDEO_SIZE
) {
  throw new Error("Missing file max size environment variables");
}

const MAX_SIZE: { [key: string]: number } = {
  photo: parseInt(process.env.MAX_PHOTO_SIZE as string),
  image: parseInt(process.env.MAX_IMAGE_SIZE as string),
  video: parseInt(process.env.MAX_VIDEO_SIZE as string),
};

export const validateSize = (
  fileType: string,
  fileSize: number,
  fieldName: string
) => {
  const maxSize = MAX_SIZE[fileType];

  if (!maxSize) {
    throw new Error("maxSize not found");
  }

  const invalid = fileSize > maxSize;
  let error = null;

  if (invalid) {
    error = `${fieldName} must be under ${convertToMB(maxSize)}MB`;
  }

  return { invalid, error };
};

const convertToMB = (size: number) => {
  return Math.floor(size / 1024 / 1024);
};

export const getPhotoFilePath = (req: Req) => {
  const randomString = crypto.randomBytes(20).toString("hex");

  const roomBaseName = req.params.roomId ? req.params.roomId : randomString;
  const folder = req.url.includes("rooms") ? "rooms" : "users";

  const fileBaseName =
    folder === "rooms" ? roomBaseName : (req.user?._id as string);

  return `${folder}/${fileBaseName}`;
};
