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

export const serverError = (): ErrorResponse => ({
  statusCode: 500,
  body: {
    message: "Internal server error",
  },
});

export const badRequest = (message: string): ErrorResponse => ({
  statusCode: 400,
  body: { message },
});

export const successResponse = <T>(body: T): SuccessResponse<T> => ({
  statusCode: 200,
  body,
});

export const ok = (): SuccessResponse<{ message: string }> => ({
  statusCode: 200,
  body: { message: "Operation successful" },
});

export const unauthorized = (message: string = "Unauthorized") => ({
  statusCode: 401,
  body: { message },
});
