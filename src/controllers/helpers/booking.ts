export const bookingNotFoundResponse = () => ({
  statusCode: 404,
  body: {
    error: "Booking not found.",
  },
});
