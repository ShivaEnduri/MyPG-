import useMediaQuery from "./useMediaQuery";

type Breakpoints = {
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
  current: string;
};

/**
 * useBreakpoint
 * - Returns booleans for Tailwind-like breakpoints and the current active breakpoint key.
 * - Based on min-width queries so it's easy to reason about "up" breakpoints.
 */
export default function useBreakpoint(): Breakpoints {
  const isSm = useMediaQuery("(min-width: 640px)");
  const isMd = useMediaQuery("(min-width: 768px)");
  const isLg = useMediaQuery("(min-width: 1024px)");
  const isXl = useMediaQuery("(min-width: 1280px)");
  const is2xl = useMediaQuery("(min-width: 1536px)");

  let current = "xs";
  if (is2xl) current = "2xl";
  else if (isXl) current = "xl";
  else if (isLg) current = "lg";
  else if (isMd) current = "md";
  else if (isSm) current = "sm";

  return {
    isXs: !isSm,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    current,
  };
}
