import { useEffect, useState } from "react";

/**
 * Brief simulated loading window for pages backed by synchronous mock
 * services. Keeps a real loading/skeleton path in the UI so it's a small
 * change to point this at an actual async API call later.
 */
export function useMockLoading(deps: React.DependencyList = [], delayMs = 400): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the
    // loading flag when deps change, mirrored by existing pages in this codebase
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), delayMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return loading;
}
