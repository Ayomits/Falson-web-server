import { subtractPercent } from "../substractPercent";

describe("substractPercent", () => {
  test(`подсчет стоимости брака`, () => {
    const firstNum = 10;
    const percent = 50;
    const result = subtractPercent(firstNum, percent);

    expect(result).toBe(15);
  });

  test(`отрицательные значения`, () => {
    const firstNum = 10;
    const percent = -50;
    const result = subtractPercent(firstNum, percent);

    expect(result).toBe(15);
  });
});
