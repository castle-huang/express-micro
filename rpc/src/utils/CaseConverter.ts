import humps from 'humps';

/**
 * Convert camelCase to snake_case (using humps)
 */
export function camelToSnake<T>(obj: T, options?: humps.HumpsOptions): T {
    return humps.decamelizeKeys(obj, {
        separator: '_',
        ...options
    }) as T;
}

/**
 * Convert snake_case to camelCase (using humps)
 */
export function snakeToCamel<T>(obj: T, options?: humps.HumpsOptions): T {
    return humps.camelizeKeys(obj, options) as T;
}
