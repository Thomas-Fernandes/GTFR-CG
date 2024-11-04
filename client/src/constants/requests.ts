export enum ResponseStatus {
  Info = "info",
  Success = "success",
  Warn = "warn",
  Error = "error",
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,

  MULTIPLE_CHOICES: 300,
  REDIRECTION: 301,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,

  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVER_UNAVAILABLE: 503,
};
