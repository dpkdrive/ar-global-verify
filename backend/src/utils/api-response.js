export const sendSuccess = (res, { status = 200, message, data, meta } = {}) =>
  res.status(status).json({ success: true, ...(message && { message }), ...(data !== undefined && { data }), ...(meta && { meta }) });

export const paginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
