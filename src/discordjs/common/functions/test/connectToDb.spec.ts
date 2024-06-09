import mongoose from "mongoose";
import { connectToDb } from "../connectToDb"; // Замените 'your-file-name' на путь к вашему файлу

describe("connectToDb", () => {
  // Предварительная настройка перед запуском каждого теста
  beforeEach(() => {
    // Создаем мок для функции mongoose.connect
    jest.spyOn(mongoose, "connect");
  });

  // После выполнения каждого теста восстанавливаем исходное состояние
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Успешное подключение к базе данных", async () => {
    // Вызываем функцию connectToDb
    await connectToDb();

    // Проверяем, что функция mongoose.connect была вызвана с правильными аргументами
    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MIGRATE_MONGO_URI || "mongodb://127.0.0.1:27017/",
      {
        autoCreate: false,
        bufferCommands: true,
      }
    );
  });

  test("Обработка ошибок подключения", async () => {
    // Создаем мок для функции mongoose.connect, которая будет возвращать ошибку
    jest
      .spyOn(mongoose, "connect")
      .mockRejectedValue(new Error("Connection failed"));

    // Вызываем функцию connectToDb
    await expect(connectToDb()).rejects.toThrow("Connection failed");
  });
});
