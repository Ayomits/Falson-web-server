
export function getClassProperties(target: any): string[] {
  const properties = Reflect.ownKeys(target.prototype).filter(key => key !== 'constructor') as string[];
  return properties;
}

export function getAllProperties(target: any): string[] {
  const properties = getClassProperties(target);

  const nestedProperties = properties.flatMap(property => {
    const propertyType = Reflect.getMetadata('design:type', target.prototype, property);

    if (propertyType && typeof propertyType === 'function' && propertyType !== String && propertyType !== Number && propertyType !== Boolean && propertyType !== Array) {
      return getAllProperties(propertyType).map(nestedProperty => `${property}.${nestedProperty}`);
    }

    return [property];
  });

  return nestedProperties;
}
