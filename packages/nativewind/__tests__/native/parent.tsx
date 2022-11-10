import { render } from "@testing-library/react-native";
import { StyledComponent } from "../../src";
import { create } from "../test-utils";

test(":first", () => {
  create("first:text-black parent");

  const Parent = jest.fn(({ children }) => children);
  const Child1 = jest.fn();
  const Child2 = jest.fn();

  render(
    <StyledComponent component={Parent} className="parent">
      <StyledComponent component={Child1} className="first:text-black" />
      <StyledComponent component={Child2} className="first:text-black" />
    </StyledComponent>
  );

  expect(Parent).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );
});

test(":last", () => {
  create("last:text-black parent");

  const Parent = jest.fn(({ children }) => children);
  const Child1 = jest.fn();
  const Child2 = jest.fn();

  render(
    <StyledComponent component={Parent} className="parent">
      <StyledComponent component={Child1} className="last:text-black" />
      <StyledComponent component={Child2} className="last:text-black" />
    </StyledComponent>
  );

  expect(Parent).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );
});

test(":odd", () => {
  create("odd:text-black parent");

  const Parent = jest.fn(({ children }) => children);
  const Child1 = jest.fn();
  const Child2 = jest.fn();
  const Child3 = jest.fn();

  render(
    <StyledComponent component={Parent} className="parent">
      <StyledComponent component={Child1} className="odd:text-black" />
      <StyledComponent component={Child2} className="odd:text-black" />
      <StyledComponent component={Child3} className="odd:text-black" />
    </StyledComponent>
  );

  expect(Parent).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child3).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );
});

test(":even", () => {
  create("even:text-black parent");

  const Parent = jest.fn(({ children }) => children);
  const Child1 = jest.fn();
  const Child2 = jest.fn();
  const Child3 = jest.fn();

  render(
    <StyledComponent component={Parent} className="parent">
      <StyledComponent component={Child1} className="even:text-black" />
      <StyledComponent component={Child2} className="even:text-black" />
      <StyledComponent component={Child3} className="even:text-black" />
    </StyledComponent>
  );

  expect(Parent).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child1).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );

  expect(Child2).toHaveBeenCalledWith(
    expect.objectContaining({
      style: {
        color: "#000",
      },
    }),
    {}
  );

  expect(Child3).toHaveBeenCalledWith(
    expect.objectContaining({
      style: undefined,
    }),
    {}
  );
});
