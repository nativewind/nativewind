import React from "react";

import { Analytics } from "@vercel/analytics/react";

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
