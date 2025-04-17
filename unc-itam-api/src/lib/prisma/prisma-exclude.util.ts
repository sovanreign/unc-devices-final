/**
 * This helper function can be use in Prisma client `select` to exclude
 * certain fields as Prisma doesn't provide default one for that.
 *
 * https://medium.com/@hala.s.salim/enhancing-security-in-nestjs-with-prisma-excluding-sensitive-fields-86d9789c0823
 */

import { Prisma } from 'generated/prisma';

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

export function prismaExclude<T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[],
) {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
}
