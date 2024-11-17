import { createContext } from "react";

import { StyleValueDescriptor } from "./types";

/**
 * Variables
 */
export type VariableContextValue = Record<string, StyleValueDescriptor>[];
export const VariableContext = createContext<VariableContextValue>([]);

/**
 * Containers
 */
export type ContainerContextValue = Record<string, ContainerContextRecord>;
export type ContainerContextRecord = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};
export const ContainerContext = createContext<ContainerContextValue>({});
