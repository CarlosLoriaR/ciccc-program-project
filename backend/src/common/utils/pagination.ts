export interface PageParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePageParams(query: Record<string, unknown>, defaultLimit = 20, maxLimit = 100): PageParams {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(query.limit) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export function toPagedResult<T>(items: T[], total: number, params: PageParams): PagedResult<T> {
  return { items, page: params.page, limit: params.limit, total };
}
