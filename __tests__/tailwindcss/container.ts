import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Container", [
  [
    "container",
    {
      styles: {
        container: { width: "100%" },
        "container.0": { maxWidth: 640 },
        "container.1": { maxWidth: 768 },
        "container.2": { maxWidth: 1024 },
        "container.3": { maxWidth: 1280 },
        "container.4": { maxWidth: 1536 },
      },
      media: {
        container: [
          "(min-width: 640px)",
          "(min-width: 768px)",
          "(min-width: 1024px)",
          "(min-width: 1280px)",
          "(min-width: 1536px)",
        ],
      },
    },
  ],
  [
    "sm:container",
    {
      styles: {
        "sm_container.0": { width: "100%" },
        "sm_container.1": { maxWidth: 640 },
        "sm_container.2": { maxWidth: 768 },
        "sm_container.3": { maxWidth: 1024 },
        "sm_container.4": { maxWidth: 1280 },
        "sm_container.5": { maxWidth: 1536 },
      },
      media: {
        sm_container: [
          "(min-width: 640px)",
          "(min-width: 640px)",
          "(min-width: 640px) and (min-width: 768px)",
          "(min-width: 640px) and (min-width: 1024px)",
          "(min-width: 640px) and (min-width: 1280px)",
          "(min-width: 640px) and (min-width: 1536px)",
        ],
      },
    },
  ],
]);
