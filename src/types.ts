import { NextFunction, Request, Response } from "express";
import { FilterQuery, Model, PipelineStage } from "mongoose";

import { TUser } from "./models/User";
import { TRoom } from "./models/Room";

export type Req = Request & Partial<AdditionalRequestProperties>;
export type Res = Response & Partial<AdditionalResponseProperties>;
export type Next = NextFunction;

interface AdditionalRequestProperties {
  // Any additional properties on the Request object...
  user: TUser;
  room: TRoom;
  model: typeof Model;
  filterQuery: FilterQuery<any>;
  populateQuery: PopulateQuery[];
  pipeline: PipelineStage[];
}

interface AdditionalResponseProperties {
  // Any additional properties on the Response object...
}

type PopulateQuery = {
  path: string;
  select?: string;
  populate?: PopulateQuery[];
};
