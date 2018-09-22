type JustProps<T> = Pick<T, ({ [P in keyof T]: T[P] extends Function ? never : P })[keyof T]>;
type JustMethods<T> = Pick<T, ({ [P in keyof T]: T[P] extends Function ? P : never })[keyof T]>;
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
