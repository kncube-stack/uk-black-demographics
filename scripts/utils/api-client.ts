// =============================================================================
// Shared API Client — Used by all fetcher scripts
// =============================================================================
// Provides retry logic, rate limiting, and consistent error handling
// for fetching from ONS, Nomis, DWP, and other government APIs.
// =============================================================================

interface FetchOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Base delay in ms between retries, doubled each attempt (default: 1000) */
  retryDelay?: number;
  /** Request timeout in ms (default: 30000) */
  timeout?: number;
  /** Additional headers */
  headers?: Record<string, string>;
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
  headers: {},
};

/**
 * Fetch with retry logic and timeout.
 * Retries on 429 (rate limit), 500, 502, 503, 504.
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          ...opts.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) return response;

      // Retry on specific status codes
      if ([429, 500, 502, 503, 504].includes(response.status)) {
        const retryAfter = response.headers.get("Retry-After");
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : opts.retryDelay * Math.pow(2, attempt);

        console.warn(
          `  ⚠ ${response.status} from ${url} — retrying in ${delay}ms (attempt ${attempt + 1}/${opts.maxRetries})`
        );
        await sleep(delay);
        continue;
      }

      // Non-retryable error
      throw new Error(
        `HTTP ${response.status} ${response.statusText} from ${url}`
      );
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (lastError.name === "AbortError") {
        console.warn(
          `  ⚠ Timeout fetching ${url} — retrying (attempt ${attempt + 1}/${opts.maxRetries})`
        );
      }

      if (attempt < opts.maxRetries) {
        await sleep(opts.retryDelay * Math.pow(2, attempt));
      }
    }
  }

  throw new Error(
    `Failed after ${opts.maxRetries} retries: ${lastError?.message ?? url}`
  );
}

/** Fetch and parse JSON with retry */
export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithRetry(url, options);
  return response.json() as Promise<T>;
}

/** Fetch raw text (for CSV downloads) with retry */
export async function fetchText(
  url: string,
  options: FetchOptions = {}
): Promise<string> {
  const response = await fetchWithRetry(url, {
    ...options,
    headers: { Accept: "text/csv, text/plain, */*", ...options.headers },
  });
  return response.text();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Simple rate limiter — ensures minimum delay between calls.
 * Usage: const limiter = createRateLimiter(500);
 *        await limiter(); // waits if needed
 */
export function createRateLimiter(minDelayMs: number) {
  let lastCallTime = 0;

  return async () => {
    const now = Date.now();
    const elapsed = now - lastCallTime;
    if (elapsed < minDelayMs) {
      await sleep(minDelayMs - elapsed);
    }
    lastCallTime = Date.now();
  };
}
