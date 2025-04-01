import { Observable } from 'rxjs'

/**
 * Utility type that transforms properties of a type into observable properties.
 * For each property of type T, creates:
 * - A private BehaviorSubject property (_propertyName)
 * - A public Observable property (propertyName$)
 *
 * @example
 * interface UserData {
 *   name: string;
 *   age: number;
 * }
 *
 * type ObservableUserData = ObservableProps<UserData>;
 * // Results in:
 * // {
 * //   name$: Observable<string>;
 * //   age$: Observable<number>;
 * // }
 */
export type ObservableProps<T> = {
  [K in keyof T as `${string & K}$`]: Observable<T[K]>
}
