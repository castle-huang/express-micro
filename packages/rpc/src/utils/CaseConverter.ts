import humps from 'humps';

/**
 * Convert camelCase to snake_case (using humps)
 */
export function camelToSnakeWithHumps<T>(obj: T, options?: humps.HumpsOptions): T {
    return humps.decamelizeKeys(obj, {
        separator: '_',
        ...options
    }) as T;
}

/**
 * Convert snake_case to camelCase (using humps)
 */
export function snakeToCamelWithHumps<T>(obj: T, options?: humps.HumpsOptions): T {
    return humps.camelizeKeys(obj, options) as T;
}
