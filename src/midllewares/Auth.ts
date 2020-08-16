import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  idUsuario: string,
}

export default async function auth(request: Request, response: Response, next: NextFunction) {
  const { authorization } = request.headers;
  if (!authorization) {
    return response
      .status(401)
      .json({
        mensagem: "Nenhum token informado"
      })
  }
  const parts = authorization.split(' ');
  if (parts.length !== 2) {
    return response
      .status(401)
      .json({
        mensagem: "Erro no token."
      })
  }
  const [schema, token] = parts;
  if (!/^Bearer$/i.test(schema)) {
    return response
      .status(401)
      .json({
        mensagem: "Token mal formatado."
      })
  }
  try {
    const decoded = jwt.verify(token, process.env.APP_SECRET as string);
    if (decoded) {
      const { idUsuario } = decoded as DecodedToken;
      request.body.idUsuario = idUsuario;
      return next();
    }
  }
  catch (error) {
    console.log(error);
    return response
      .status(401)
      .json({
        mensagem: "Token inválido."
      })
  }
}