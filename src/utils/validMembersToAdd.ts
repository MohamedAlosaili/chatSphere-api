import { isValidObjectId } from "mongoose";

import Member from "../models/Member";
import Message from "../models/Message";
import User from "../models/User";

interface Options {
  checkRoomMembers?: boolean;
  simpleErrorMessage?: boolean;
}

const validMembersToAdd = async (
  members: string[],
  ownerId: string,
  roomId: string,
  options?: Options
) => {
  try {
    if (!Array.isArray(members) || members.length === 0) {
      throw "Invalid/Missing members array";
    }

    const isMemberIdsValid = members.every(id => isValidObjectId(id));
    if (!isMemberIdsValid) throw "One or more member IDs are invalid";

    // If the room owner want to add more members - must check the old member to prevent duplicates members error
    let roomMemberIds: string[] = [];
    if (options?.checkRoomMembers) {
      const roomMembers = await Member.find({
        memberId: { $in: members },
        roomId,
      });
      roomMemberIds = roomMembers.map(member => String(member.memberId));
    }

    // Remove duplicates, owner id, and member ids(members already exist in the room)
    const filteredMemberIds = Array.from(new Set(members)).filter(
      memberId => memberId !== ownerId && !roomMemberIds.includes(memberId)
    );
    if (filteredMemberIds.length === 0) throw "Members already joined the room";

    // IDs not in the users collection will be treated as invalid IDs
    const validMembers = await User.find({
      _id: { $in: filteredMemberIds },
    });
    if (validMembers.length === 0) {
      throw "No valid members to add";
    }

    const names = validMembers.map(member => member.username).join(", ");
    const validMembersToAdd = validMembers.map(member => ({
      memberId: member._id,
      roomId,
    }));

    await Promise.all([
      Member.create(validMembersToAdd),
      Message.create({
        type: "announcement",
        content: `${names} added`,
        roomId,
      }),
    ]);

    return { success: true, data: names, error: null };
  } catch (err) {
    if (options?.simpleErrorMessage) {
      return { success: false, error: "failed to add members" };
    } else {
      return {
        success: false,
        error: typeof err === "string" ? err : String(err),
      };
    }
  }
};

export default validMembersToAdd;
