import { createContext } from "react";

import type { ContainerRecord, ExtractionWarning } from "../../types";

export const warnings = new Map<string, ExtractionWarning[]>();
export const flags = new Map<string, unknown>();

export const containerContext = createContext<ContainerRecord>({});
