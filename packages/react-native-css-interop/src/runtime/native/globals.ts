import type { ContainerRecord, ExtractionWarning } from "../../types";
import { createContext } from "react";

export const warnings = new Map<string, ExtractionWarning[]>();

export const containerContext = createContext<ContainerRecord>({});
