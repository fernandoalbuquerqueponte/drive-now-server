type SuccessResponse<T> = {
  statusCode: number;
  body: T;
};

type ErrorResponse = {
  statusCode: number;
  body: {
    message: string;
  };
};

export const created = <T>(body: T): SuccessResponse<T> => ({
  statusCode: 201,
  body,
});

export const serverError = <T>(): ErrorResponse => ({
  statusCode: 500,
  body: {
    message: "Internal server error",
  },
});

export const badRequest = <T>(message: string): ErrorResponse => ({
  statusCode: 400,
  body: { message },
});

export const successResponse = <T>(body: T): SuccessResponse<T> => ({
  statusCode: 200,
  body,
});
