import { useEffect, RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  ignoredRefs: RefObject<HTMLElement | null>[] = []
) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      
      if (!ref.current || ref.current.contains(target as Node)) return;

      for (const ignoredRef of ignoredRefs) {
        if (ignoredRef.current?.contains(target as Node)) {
          return;
        }
      }

      if (target?.closest("[data-ignore-outside-click]")) return;


      handler();
    };

    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler, ignoredRefs]);
}
