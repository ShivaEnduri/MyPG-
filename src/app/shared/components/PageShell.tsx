// src/app/shared/components/PageShell.tsx
import { FC, ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  bottomPad?: number;
  className?: string;
  /**
   * When true: locks the page to exactly one viewport (h-[100dvh],
   * overflow-hidden) and makes <main> a flex column, so a child section
   * can take flex-1 min-h-0 and become the ONLY part of the page that
   * scrolls. Use for single-screen pages (e.g. Vacancy Pipeline).
   *
   * When false (default): normal scrolling page, same as before —
   * Owner Dashboard, Bed Map, Residents keep using this.
   */
  noScroll?: boolean;
}

export const PageShell: FC<PageShellProps> = ({
  children,
  bottomPad = 0,
  className = "",
  noScroll = false,
}) => {
  if (noScroll) {
    return (
      <div className={`h-[100dvh] overflow-hidden bg-[#FAFBFC] flex flex-col ${className}`}>
        <main
          className="
            mx-auto w-full flex-1 min-h-0
            flex flex-col
            px-2.5 pt-1.5
            sm:px-5 sm:pt-3
            max-w-[750px]
            lg:max-w-[1080px]
            xl:max-w-[1320px]
            2xl:max-w-[1600px]
          "
          style={{ paddingBottom: bottomPad ? `${bottomPad}px` : undefined }}
        >
          {children}
        </main>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[100dvh] overflow-hidden bg-[#FAFBFC] ${className}`}
      style={bottomPad ? { paddingBottom: `${bottomPad}px` } : undefined}
    >
      <main
        className="
          mx-auto w-full
          px-2.5 pb-2 pt-1.5
          sm:px-5 sm:pb-5 sm:pt-3
          max-w-[750px]
          lg:max-w-[1080px]
          xl:max-w-[1320px]
          2xl:max-w-[1600px]
        "
      >
        {children}
      </main>
    </div>
  );
};