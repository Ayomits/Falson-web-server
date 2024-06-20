import { plainToInstance } from 'class-transformer';
import { isArray, isObject } from 'class-validator';

type KeyValue<T> = {
  [key in keyof T]: any;
};

export function validateProperties<T>(
  validateDtos: KeyValue<T>,
  dto: any,
  prevalidateClass: any,
) {
  const outputData = {};
  const preValidate = plainToInstance(prevalidateClass, dto);
  Object.keys(preValidate).forEach((key) => {
    const validateKey = validateDtos[key];
    if (validateKey) {
      if (isArray(dto[key])) {
        outputData[key] = plainToInstance(validateKey, dto[key], {
          enableCircularCheck: true,
          excludeExtraneousValues: true,
        });
        return;
      }
      outputData[key] = plainToInstance(validateKey, dto[key], {
        excludeExtraneousValues: true,
      });
      return;
    }
    outputData[key] = dto[key];
    return;
  });
  return outputData;
}

const isNestedObject = (value: any): boolean => {
  return (
    isObject(value) &&
    !isArray(value) &&
    typeof value !== 'function' &&
    value !== null
  );
};

export const clearUsedFields = (dto: any, existed: any) => {
  Object.keys(dto).forEach(key => {
    const obj = dto[key]
    if (isNestedObject(obj)){
      Object.keys(obj).forEach(key_ => {
        if ((obj[key_] === undefined) && (existed[key][key_] !== undefined)){
          obj[key_] = existed[key][key_]
        }
      })
    }
  })
  return dto
};