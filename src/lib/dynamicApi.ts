import api from "@/utils/axios";

const buildUri = (
  endpoint: string,
  query: Record<string, any> = {}
): string => {
  const queryString = Object.entries(query)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return `/api/${endpoint}${queryString ? `?${queryString}` : ""}`;
};

export const getAllData = async <T>(
  endpoint: string,
  query: Record<string, any> = {},
  isApi: boolean = true
): Promise<T> => {
  const uri = buildUri(endpoint, query);
  const response = await api.get<T>(uri);
  return response.data;
};
