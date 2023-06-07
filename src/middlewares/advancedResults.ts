import { Query } from "mongoose";

import asyncHandler from "./asyncHandler";

const advancedResults = asyncHandler(async (req, res, next) => {
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

  const total = await req.model.countDocuments(req.filterQuery ?? {});

  query = query.skip(startIndex).limit(limit);

  const results = await query;

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

export default advancedResults;
