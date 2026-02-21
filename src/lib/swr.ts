import { apiRequest } from './api';

/**
 * SWR fetcher — wraps our existing apiRequest function.
 * Usage: useSWR('/artworks', fetcher)
 */
export const fetcher = <T>(endpoint: string): Promise<T> =>
    apiRequest<T>(endpoint);
