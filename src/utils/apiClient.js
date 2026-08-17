/**
 * Hybrid Network API Client with Automatic Offline Fallback
 * Guarantees that API calls never throw unhandled network errors or crash the mobile app.
 */

const API_TIMEOUT_MS = 2000;

export async function safeApiFetch(endpoint, options = {}, fallbackData = null) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const fetchOptions = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const res = await fetch(endpoint, fetchOptions);
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
  } catch (err) {
    clearTimeout(timeoutId);
    // Silent fallback when offline or server unreachable
  }

  return { success: false, data: fallbackData };
}
