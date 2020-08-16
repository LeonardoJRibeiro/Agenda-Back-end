import { Request, Response } from "express";
import Procedimento from "../models/Procedimento";

export default class ProcedimentoController {
  async create(request: Request, response: Response) {
    const dados = request.body;
    const descricao = dados.descricao as string;
    const duracao = dados.duracao as number;
    const idUsuario = dados.idUsuario as string;
    if (!descricao || !duracao || !idUsuario) {
      return response.status(406).send()
    }
    try {
      const quantidadeExistente = await Procedimento.countDocuments({ descricao, idUsuario });
      if (quantidadeExistente) {
        return response.status(406).json({ mensagem: "Procedimento já cadastrado." });
      }
      await Procedimento.create({
        descricao,
        duracao,
        idUsuario
      });
    }
    catch (erro) {
      console.log(erro);
      return response.status(400).send();
    }
    return response.status(201).json({ mensagem: "Procedimento cadastrado com sucesso." });
  }

  async index(request: Request, response: Response) {
    const idUsuario = request.body.idUsuario as string;
    try {
      const procedimentos = await Procedimento.find({idUsuario});
      return response.json(procedimentos)
    }
    catch(erro){
      console.log(erro);
      return response.status(400).send();
    }
  }

}