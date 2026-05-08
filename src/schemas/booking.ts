import { z } from "zod/v4";

export const cancelBookingSchema = z.object({
  userId: z.uuid(),
  params: z.object({
    bookingId: z.uuid(),
  }),
});

export const getBookingsByCarIdSchema = z.object({
  params: z.object({
    carId: z.uuid(),
  }),
});
