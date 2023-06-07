import { NextFunction, Request, Response } from "express";
import { TUser } from "./models/User";
import { FilterQuery, Model } from "mongoose";

export type Req = Request & Partial<AdditionalRequestProperties>;
export type Res = Response & Partial<AdditionalResponseProperties>;
export type Next = NextFunction;

interface AdditionalRequestProperties {
  user: TUser;
  model: typeof Model;
  filterQuery: FilterQuery<any>;
  populateQuery: PopulateQuery[];
}

interface AdditionalResponseProperties {
  advancedResults: AdvancedResults;
}

type PopulateQuery = {
  path: string;
  select?: string;
  populate?: PopulateQuery[];
};

interface AdvancedResults {
  success: boolean;
  data: any;
  pagination: {
    next: boolean;
    prev: boolean;
    limit: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  total: number;
}
