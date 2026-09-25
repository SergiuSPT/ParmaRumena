import { useEffect, useLayoutEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const API_URL = import.meta.env.VITE_API_URL ?? "";

type Collection<T> =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; data: T[]; demo: boolean };

export function useCollection<T>(path: string) {
  const [attempt, setAttempt] = useState(0);

  const [result, setResult] = useState<{
    attempt: number;
    path: string;
    collection: Collection<T>;
  } | null>(null);

  const collection: Collection<T> =
    result?.attempt === attempt && result.path === path
      ? result.collection
      : { status: "loading" };

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const timeout = window.setTimeout(
      () => controller.abort(),
      12000
    );

    async function load() {
      try {
        const response = await fetch(
          `${API_URL}${path}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Request failed: ${response.status}`
          );
        }

        const payload = await response.json();

        if (!Array.isArray(payload.data)) {
          throw new Error("Invalid collection");
        }

        if (!cancelled) {
          setResult({
            attempt,
            path,
            collection: {
              status: "ready",
              data: payload.data,
              demo: payload.demo === true,
            },
          });
        }
      } catch (error) {
        console.error(
          `Failed to load ${path}:`,
          error
        );

        if (!cancelled) {
          setResult({
            attempt,
            path,
            collection: {
              status: "error",
            },
          });
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void load();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [path, attempt]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() =>
      ScrollTrigger.refresh()
    );

    return () => cancelAnimationFrame(frame);
  }, [result]);

  return {
    collection,
    retry: () =>
      setAttempt((value) => value + 1),
  };
}