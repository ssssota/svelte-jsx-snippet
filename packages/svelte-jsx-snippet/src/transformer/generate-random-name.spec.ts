import { expect, it } from "vitest";
import { generateRandomName } from "./generate-random-name";

it("generate random name excluding existing names", () => {
  const actual = generateRandomName("fooo");
  expect(actual).not.toBe("fooo");
  expect(actual).toHaveLength(4); // default length
});
