import { createContext } from "react";
import { Observable, Effect, observable } from "../observable";
import { globalVariables } from "./globals";

export type InheritedParentContext = {
  active?: Observable<boolean>;
  hover?: Observable<boolean>;
  focus?: Observable<boolean>;
  layout?: Observable<[number, number] | undefined>;
  container: Observable<InheritedParentContext | undefined>;
  getContainer(
    name: string,
    effect: Effect,
    isParent?: boolean,
  ): Observable<InheritedParentContext | undefined> | undefined;
  getVariable(name: string, effect: Effect): Observable<any> | undefined;
  getActive(effect: Effect): boolean;
  getHover(effect: Effect): boolean;
  getFocus(effect: Effect): boolean;
  getLayout(effect: Effect): [number, number] | undefined;
};

export const inheritanceContext = createContext<InheritedParentContext>({
  container: observable(undefined),
  getContainer: () => undefined,
  getVariable: (name, effect) => globalVariables.root.get(name)?.get(effect),
  getActive: () => false,
  getHover: () => false,
  getFocus: () => false,
  getLayout: () => undefined,
});
