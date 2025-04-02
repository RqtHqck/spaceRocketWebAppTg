module.exports = class ApiError extends Error {
  constructor(status, message, code, originalError, details=[]) {
      super(message); // Устанавливаем сообщение ошибки
      this.status = status; // HTTP-статус ошибки
      this.code = code; // Код ошибки
      this.name = this.constructor.name; // Указываем имя класса
      this.details = details;
      // Если передана оригинальная ошибка, добавляем её стек
      if (originalError) {
        const safeError = originalError instanceof Error ? originalError : new Error(String(originalError));
        this.stack = `${this.stack}\nCaused by: ${safeError.stack}`;  // Добавляем стек оригинальной ошибки
      }

      // Устанавливаем прототип для корректного наследования
      Object.setPrototypeOf(this, new.target.prototype);
  }

  // Методы для создания стандартных HTTP-ошибок

  static badRequest(message = "Bad Request", originalError) {
      return new ApiError(400, message, "BAD_REQUEST", originalError);
  }

  static validationError(message = "Validation Error", originalError, details) {
    return new ApiError(400, message, "VALIDATION_ERROR", originalError, details);
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

  static transactionError(message = "Transaction Error", originalError) {
    return new ApiError(422, message, "TRANSACTION_ERROR", originalError);
  }

  static userError(status = 500, message = "Something went wrong with user", originalError) {
    switch (status) {
      case 500:
        return new ApiError(status, message, "USER_ERROR", originalError);
      case 400:
        return new ApiError(status, message, "USER_FOUND_ERROR", originalError);
    }
  }

  static databaseError(status = 500, message = "Database error", originalError) {
    switch (status) {
      case 500:
        return new ApiError(status, message, "DATABASE_ERROR", originalError);
      case 404:
        return new ApiError(status, message, "DATABASE_FOUND_ERROR", originalError);
    }
  }

  static eventError(message = "Event Error", originalError) {
    return new ApiError(500, message, "EVENT_ERROR", originalError);
  }

  static internalError(message = "Internal Server Error", originalError) {
      return new ApiError(500, message, "INTERNAL_SERVER_ERROR", originalError);
  }
}