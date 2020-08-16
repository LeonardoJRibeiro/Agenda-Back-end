import { Request, Response } from "express"
import bcrypt from 'bcrypt';
import Usuario from "../models/Usuario";
import jwt from 'jsonwebtoken';

interface Usuario {
  nomeUsuario: string,
  senha: string,
  _id?: string,
  nome: string,
}

export default class UsuarioController {
  async create(request: Request, response: Response) {
    const data = request.body
    const nomeUsuario = data.nomeUsuario as string;
    const nome = data.nome as string;
    const senha = data.senha as string;
    try {
      const quantidadeUsuariosComMesmoNome = await Usuario.countDocuments({ nomeUsuario });
      if (quantidadeUsuariosComMesmoNome) {
        return response.status(406).json({ mensagem: "Usuário já existente." });
      }
      await bcrypt.hash(senha, 10, async (error, hash) => {
        if (error) {
          console.log(error);
        }
        await Usuario.create({
          nomeUsuario,
          nome,
          senha: hash
        })
          .catch(error => console.log(error))
      });
      return response.status(201).json({ mensagem: "Usuário cadastrado com sucesso." })
    }
    catch (error) {
      console.log(error);
      return response.status(400);
    }
  }
  async login(request: Request, response: Response) {
    const data = request.body;
    const nomeUsuario = data.nomeUsuario as string;
    const senha = data.senha as string;
    const usuario = await Usuario.findOne({ nomeUsuario }).select({ senha: 1, nomeUsuario: 1, nome: 1 })
    if (usuario) {
      try {
        const resultado = await bcrypt.compare(senha, usuario.senha as string,);
        if (resultado) {
          const token = jwt.sign({ idUsuario: usuario._id }, process.env.APP_SECRET as string, { expiresIn: 86400 })
          return response.json({
            nomeUsuario,
            nome: usuario.nome,
            token
          })
        }
        else {
          return response.status(401).json({
            mensagem: "Senha incorreta."
          })
        }
      }
      catch(erro){
        console.log(erro);
        return response.status(401).json({
          mensagem: "Senha incorreta."
        })
      }
    }
    else {
      return response.status(401).json({
        mensagem: "Usuário inexistente."
      })
    }
  }

  async loginPorToken(request: Request, response: Response) {
    const idUsuario = request.body.idUsuario;
    try {
      const usuario = await Usuario.findOne({ _id: idUsuario }).select({ nomeUsuario: 1, nome: 1 })
      if (usuario) {
        return response.json({
          nomeUsuario: usuario.nomeUsuario,
          nome: usuario.nome,
        })
      }
      else {
        return response.status(401).json({
          mensagem: "Usuário inexistente."
        })
      }
    }
    catch (erro) {
      console.log(erro);
      return response.status(400).send()
    }
  }
}