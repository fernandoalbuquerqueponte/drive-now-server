import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    // pegar o access token do Header
    const accessToken = request.headers?.authorization?.split("Bearer ")[1];
    if (!accessToken) {
      return response.status(401).send({ message: "Unauthorized" });
    }

    //Verificar se o access token é válido
    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET!, //SE O TOKEN FOI GERADO POR VC E TEM A CHAVE SECRETA, ELE É VÁLIDO
    ) as { userId: string }; // SE FOR VÁLIDO ELE RETORNA O PAYLOAD

    if (!decodedToken) {
      return response.status(401).send({ message: "Unauthorized" });
    }

    request.userId = decodedToken.userId;
    //Se for válido, deixar a requisição continuar
    next();
    //Se não for válido, retornar um erro 401
  } catch (error) {
    console.error(error);
    return response.status(401).send({ message: "Unauthorized" });
  }
};
