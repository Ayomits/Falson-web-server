export function hasAdminPermission(permissions: number): boolean {
  const ADMIN_BIT = 1 << 3; // 1 сдвинутое влево на 3 позиции, что равно 8
  return (permissions & ADMIN_BIT) !== 0;
}
