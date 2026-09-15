import { useEffect, useState } from 'react';
import type { Scenario } from '@/types';
import { scenarios as seedScenarios } from '@/data/scenarios';
import { api } from '@/lib/api';

interface UseScenariosResult {
  scenarios: Scenario[];
  loading: boolean;
  usingFallback: boolean;
}

/**
 * Loads scenarios from the backend API. If the API is unreachable (e.g. during
 * frontend-only development, before MongoDB is connected), it falls back to
 * local seed data so the training flow keeps working.
 */
export function useScenarios(): UseScenariosResult {
  const [scenarios, setScenarios] = useState<Scenario[]>(seedScenarios);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .getScenarios()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setScenarios(data);
          setUsingFallback(false);
        }
      })
      .catch(() => {
        // Silently fall back to seed data — expected during local frontend dev.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { scenarios, loading, usingFallback };
}
