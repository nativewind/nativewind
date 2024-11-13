import type {
  ContainerCondition,
  MediaQuery as CSSMediaQuery,
  Declaration,
  SelectorComponent,
} from "lightningcss";

export type MediaQuery = CSSMediaQuery;

export interface ContainerQuery {
  // Name
  n?: string | null;
  // Conditions
  c?: ContainerCondition<Declaration>;
  // PseudoClassesQuery
  p?: PseudoClassesQuery;
  // Attribute conditions
  a?: AttributeCondition[];
}

export interface PseudoClassesQuery {
  // Hover
  h?: boolean;
  // Active
  a?: boolean;
  // Focus
  f?: boolean;
}

export type AttributeCondition = PropCondition | DataAttributeCondition;
type AttributeSelectorComponent = Extract<
  SelectorComponent,
  { type: "attribute" }
>;
export type PropCondition = Omit<AttributeSelectorComponent, "operation"> & {
  operation?:
    | AttributeSelectorComponent["operation"]
    | {
        operator: "empty" | "truthy";
      };
};

export type DataAttributeCondition = Omit<PropCondition, "type"> & {
  type: "data-attribute";
};
