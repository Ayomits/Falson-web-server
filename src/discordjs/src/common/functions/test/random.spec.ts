import { randomReward } from "../random";

describe("randomReward", () => {
  test("генерация чисел с разным диапозоном", () => {
    const min = 1;
    const max = 10;
    const result = randomReward(min, max);

    expect(result).toBeGreaterThanOrEqual(min); // Проверяем, что результат больше или равен минимальному значению
    expect(result).toBeLessThanOrEqual(max); // Проверяем, что результат меньше или равен максимальному значению
    expect(Number.isInteger(result)).toBe(true); // Проверяем, что результат является целым числом
  });

  test("обработка отрицательных чисел", () => {
    const min = -10;
    const max = -1;
    const result = randomReward(min, max);

    expect(result).toBeGreaterThanOrEqual(min); // Проверяем, что результат больше или равен минимальному значению
    expect(result).toBeLessThanOrEqual(max); // Проверяем, что результат меньше или равен максимальному значению
    expect(Number.isInteger(result)).toBe(true); // Проверяем, что результат является целым числом
  });

  test("обработка случаев, когда максимум меньше минимума", () => {
    const min = 10;
    const max = 1;
    const result = randomReward(min, max);

    expect(result).toBeGreaterThanOrEqual(max); // Проверяем, что результат больше или равен минимальному значению
    expect(result).toBeLessThanOrEqual(min); // Проверяем, что результат меньше или равен максимальному значению
    expect(Number.isInteger(result)).toBe(true); // Проверяем, что результат является целым числом
  });
});
