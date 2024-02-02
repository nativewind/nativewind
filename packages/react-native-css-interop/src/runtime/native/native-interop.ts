import { useState, useContext, useEffect } from "react";
import { InteropComponentConfig, ReactComponent } from "../../types";
import { Effect, Observable, observable } from "../observable";
import { UpgradeState, renderComponent } from "./render-component";
import { containerContext, variableContext } from "./globals";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { PropStateObservable } from "./prop-state-observable";

export type ComponentState = {
  originalProps: Record<string, any>;
  containers: Record<string, ComponentState>;
  interaction: {
    active?: Observable<boolean>;
    hover?: Observable<boolean>;
    focus?: Observable<boolean>;
    layout?: Observable<[number, number]>;
  };
  getActive(effect: Effect): boolean;
  getHover(effect: Effect): boolean;
  getFocus(effect: Effect): boolean;
  getLayout(effect: Effect): [number, number];
  rerender(): void;
  upgrades: {
    animated: number;
    variables: number;
    containers: number;
    pressable: number;
    canWarn: boolean;
  };
};

export function interop(
  baseComponent: ReactComponent<any>,
  configs: InteropComponentConfig[],
  originalProps: Record<string, any>,
  ref: any,
) {
  let variables = useContext(variableContext);
  let containers = useContext(containerContext);

  const [componentState, setComponentState] = useState<ComponentState>(() => {
    return {
      originalProps,
      containers,
      interaction: {},
      upgrades: {
        animated: UpgradeState.NONE,
        variables: UpgradeState.NONE,
        containers: UpgradeState.NONE,
        pressable: UpgradeState.NONE,
        canWarn: false,
      },
      rerender() {
        setComponentState((state) => ({ ...state }));
      },
      getActive(effect) {
        this.interaction.active ??= observable(false);
        return this.interaction.active.get(effect);
      },
      getHover(effect) {
        this.interaction.hover ??= observable(false);
        return this.interaction.hover.get(effect);
      },
      getFocus(effect) {
        this.interaction.focus ??= observable(false);
        return this.interaction.focus.get(effect);
      },
      getLayout(effect) {
        this.interaction.layout ??= observable([0, 0]);
        return this.interaction.layout.get(effect);
      },
    };
  });

  useEffect(() => {
    return () => {
      for (const state of propState) {
        state.cleanup();
      }
    };
  }, []);

  componentState.originalProps = originalProps;
  componentState.containers = containers;

  const [propState] = useState(() => {
    return configs.map((config) => {
      return new PropStateObservable(
        config,
        componentState,
        variables,
        containers,
      );
    });
  });

  let props: Record<string, any> = { ...originalProps, ref };

  for (const state of propState) {
    state.updateDuringRender(originalProps, variables, containers);

    Object.assign(props, state.props);
    if (state.config.target !== state.config.source) {
      delete props[state.config.source];
    }

    if (state.variables) {
      variables = { ...variables, ...state.variables };
    }
    if (state.containerNames) {
      containers = { ...containers };
      for (const name of state.containerNames) {
        containers[name] = componentState;
      }
      containers[DEFAULT_CONTAINER_NAME] = componentState;
    }
  }

  return renderComponent(
    baseComponent,
    componentState,
    props,
    originalProps,
    variables,
    containers,
  );
}
