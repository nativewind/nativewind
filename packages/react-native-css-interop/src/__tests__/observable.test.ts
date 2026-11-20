import { cleanupEffect, Effect, observable } from "../runtime/observable";

function createEffect(): Effect {
  return { run: jest.fn(), dependencies: new Set() };
}

test("repeated reads subscribe an effect once", () => {
  const value = observable(1);
  const effect = createEffect();

  for (let i = 0; i < 100; i++) {
    value.get(effect);
  }

  expect(effect.dependencies.size).toBe(1);

  value.set(2);
  expect(effect.run).toHaveBeenCalledTimes(1);
});

test("an effect can resubscribe after cleanup", () => {
  const value = observable(1);
  const effect = createEffect();

  value.get(effect);
  cleanupEffect(effect);
  expect(effect.dependencies.size).toBe(0);

  value.set(2);
  expect(effect.run).not.toHaveBeenCalled();

  value.get(effect);
  value.get(effect);
  expect(effect.dependencies.size).toBe(1);

  value.set(3);
  expect(effect.run).toHaveBeenCalledTimes(1);
});
