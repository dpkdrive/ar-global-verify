import { useEffect, useState } from 'react';
import { apiRequest } from '../api';

/** Fetches a paginated API resource and exposes a safe reload action. */
export function usePagedApi(endpoint, limit = 20) {
  const [data, setData] = useState({});
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const requestPage = async (targetPage = page) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: targetPage, limit });
      const payload = await apiRequest(`${endpoint}?${query}`);
      setData(payload.data ?? {});
      setMeta(payload.meta ?? null);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const fetchPage = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page, limit });
        const payload = await apiRequest(`${endpoint}?${query}`);
        if (active) {
          setData(payload.data ?? {});
          setMeta(payload.meta ?? null);
          setError('');
        }
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchPage();
    return () => { active = false; };
  }, [endpoint, limit, page]);

  return { data, meta, error, loading, page, setPage, reload: requestPage };
}
