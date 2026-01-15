export const carNotFoundResponse = () => ({
  statusCode: 404,
  body: {
    error: "Car not found.",
  },
});
