export enum ResponseStatus {
  Info = "info",
  Success = "success",
  Warn = "warn",
  Error = "error",
}

export enum HttpStatus {
  Ok = 200,
  Created = 201,
  Accepted = 202,

  MultipleChoices = 300,
  Redirection = 301,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  RequestTimeout = 408,
  Conflict = 409,
  PreconditionFailed = 412,

  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServerUnavailable = 503,
  GatewayTimeout = 504,
  NetworkAuthenticationRequired = 511,
}
