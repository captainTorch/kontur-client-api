/**
 * Декоратор для ошибок запросов
 *
 * @param {string} errorKey Код ошибки (напр., ERROR_USER_NOT_FOUND)
 * @returns {Function} Декоратор
 */
export function ApiError (errorKey: string) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
      constructor.prototype.error = errorKey
    }
}