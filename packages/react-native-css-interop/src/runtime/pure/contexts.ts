import { createContext } from "react";
import type { StyleValueDescriptor } from "./types";

/**
 * Variables
 */
export type VariableContextValue =
  | Record<string, StyleValueDescriptor>
  | Map<string, StyleValueDescriptor>;
export const VariableContext = createContext<VariableContextValue>({});
export const UniversalVariableContext = createContext<VariableContextValue>({});

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
