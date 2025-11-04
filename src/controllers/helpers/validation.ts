import validator from "validator";

export const checkIfIdIsValid = (id: string) => validator.isUUID(id);

export const invalidIdResponse = () => ({
  statusCode: 400,
  body: { message: "Invalid ID format." },
});
