export interface WhmcsBaseResponse {
  result: 'success' | 'error';
  message?: string;
}

export interface WhmcsErrorResponse extends WhmcsBaseResponse {
  result: 'error';
  message: string;
}

export interface WhmcsSuccessResponse<T = any> extends WhmcsBaseResponse {
  result: 'success';
  [key: string]: any; // Extensible for specific API action responses
}

export interface WhmcsParams {
  [key: string]: string | number | boolean | undefined;
}
