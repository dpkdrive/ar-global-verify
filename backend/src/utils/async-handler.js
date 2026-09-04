// Express 5 also forwards rejected promises; this wrapper keeps handlers portable
// and makes that behavior explicit at the route boundary.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
