import { Request, Response } from "express";
import { User } from "./models/User";

export type Req = Request & { user?: User };
export type Res = Response;
