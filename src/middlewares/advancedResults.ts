import { Aggregate, Query } from "mongoose";

import asyncHandler from "./asyncHandler";

export const advancedResults = asyncHandler(async (req, res, next) => {
  let {
    select,
    sort,
    page: pag,
    limit: lmt,
    ...reqQuery
  } = req.query as {
    [key: string]: string;
  };

  if (!req.model) {
    throw new Error("Internal Server Error");
  }

  // Add $ to MongoDB query operators
  const filterStr = JSON.stringify(reqQuery).replace(
    /\b(lt|lte|eq|gt|gte|in)\b/g,
    str => `$${str}`
  );

  const filter = { ...JSON.parse(filterStr), ...req.filterQuery };

  let query: Query<any, any> = req.model.find(filter);

  if (req.populateQuery) query = query.populate(req.populateQuery);

  // Select certain fields
  if (select) {
    const selectedFields = select.replace(/,/g, " ");
    query = query.select(selectedFields);
  }

  // Sort results by a field
  if (sort) {
    query = query.sort(sort);
  } else {
    query = query.sort("-createdAt");
  }

  // Paginate result
  let page = Math.abs(parseInt(pag)) || 1;
  let limit = Math.abs(parseInt(lmt)) || 25;

  const startIndex = (page - 1) * limit; // 0
  const endIndex = page * limit; // 25

  query = query.skip(startIndex).limit(limit);

  const [results, total] = await Promise.all([
    query,
    req.model.countDocuments(req.filterQuery ?? {}),
  ]);

  const pagination = {
    next: total > endIndex,
    prev: startIndex > 0,
    limit,
    page,
    pageSize: results.length,
    totalPages: Math.ceil(total / limit),
  };

  res.json({
    success: true,
    data: results,
    pagination,
    total,
  });
});

export const advancedAggregateResults = asyncHandler(async (req, res, next) => {
  if (!req.model || !req.pipeline) {
    throw new Error("Internal Server Error");
  }

  const { page: pag, limit: lmt } = req.query;

  const page = Math.abs(parseInt(typeof pag === "string" ? pag : "1")) || 1;
  const limit = Math.abs(parseInt(typeof lmt === "string" ? lmt : "25")) || 25;

  const startIndex = (page - 1) * limit; // 0
  const endIndex = page * limit; // 25

  const [results, countDocuments] = await Promise.all([
    req.model
      .aggregate([...req.pipeline])
      .skip(startIndex)
      .limit(limit),
    req.model.aggregate([...req.pipeline, { $count: "total" }]) as Aggregate<
      [{ total: number }]
    >,
  ]);

  const total = countDocuments?.[0]?.total ?? 0;

  const pagination = {
    next: total > endIndex,
    prev: startIndex > 0,
    limit,
    page,
    pageSize: results.length,
    totalPages: Math.ceil(total / limit),
  };

  res.json({
    success: true,
    data: results,
    pagination,
    total,
  });
});
