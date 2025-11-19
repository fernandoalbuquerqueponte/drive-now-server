export const userNotFoundResponse = () => ({
  statusCode: 404,
  body: {
    error: "User not found.",
  },
});
