// src/app/issues/page.tsx
//
// Usage example: wires IssuesDashboard into your existing PageShell
// with noScroll enabled, so this route locks to one viewport and only
// the "Open Service Requests" / "Quick Escalations" sections scroll
// internally when their "View All" button is clicked.

import { PageShell } from "@/app/shared/components/PageShell";
import  IssuesDashboard  from "./IssuesDashboard";

export default function IssuesPage() {
  return (
    <PageShell noScroll>
      <IssuesDashboard />
    </PageShell>
  );
}