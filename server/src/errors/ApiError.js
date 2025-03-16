module.exports = class ApiError extends Error {
  constructor(status, message, code, originalError) {
      super(message); // Устанавливаем сообщение ошибки
      this.name = this.constructor.name; // Указываем имя класса
      this.status = status; // HTTP-статус ошибки
      this.code = code; // Код ошибки

      // Если передана оригинальная ошибка, добавляем её стек
      if (originalError) {
          const safeError = originalError instanceof Error ? originalError : new Error(String(originalError));
          this.stack += `\nCaused by: ${safeError.stack}`;
      }

      // Устанавливаем прототип для корректного наследования
      Object.setPrototypeOf(this, new.target.prototype);
  }

  // Методы для создания стандартных HTTP-ошибок

  static badRequest(message = "Bad Request", originalError) {
      return new ApiError(400, message, "BAD_REQUEST", originalError);
  }

  static unauthorized(message = "Unauthorized", originalError) {
      return new ApiError(401, message, "UNAUTHORIZED", originalError);
  }

  static forbidden(message = "Forbidden", originalError) {
      return new ApiError(403, message, "FORBIDDEN", originalError);
  }

  static notFound(message = "Not Found", originalError) {
      return new ApiError(404, message, "NOT_FOUND", originalError);
  }

  static internalError(message = "Internal Server Error", originalError) {
      return new ApiError(500, message, "INTERNAL_SERVER_ERROR", originalError);
  }
}