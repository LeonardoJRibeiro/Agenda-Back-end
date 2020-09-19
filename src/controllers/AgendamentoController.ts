import { Request, Response } from "express";
import convertHourToMinutes from "../utils/convertHourToMinutes";
import Agendamento from "../models/Agendamento";
import { Types } from "mongoose";

export default class AgendamentoController {
  async create(request: Request, response: Response) {
    const dados = request.body;
    const cliente = dados.cliente as string;
    const data = dados.data as Date;
    const duracao = dados.duracao as number;
    const idProcedimento = dados.idProcedimento as string;
    const idUsuario = dados.idUsuario as string;
    try {
      const horaInicio = convertHourToMinutes(dados.hora as string);
      const horaFim = horaInicio + duracao;
      console.log(data);
      const agendamentoConflitantes = await Agendamento.countDocuments({
        idUsuario,
        data,
        horaFim: {
          $gt: horaInicio,
        },
        horaInicio: {
          $lt: horaFim,
        }
      });
      if (agendamentoConflitantes) {
        return response.status(406).json({ menssagem: "Existe outro agendamento nesse horário" })
      }
      await Agendamento.create({
        cliente,
        horaInicio,
        horaFim,
        data,
        idProcedimento,
        idUsuario,
      })
    }
    catch (erro) {
      console.log(erro)
      return response.status(400);
    }
    return response.status(201).json({ mensagem: "Agendamento criado com sucesso" })
  }

  async index(request: Request, response: Response) {
    const idUsuario = request.body.idUsuario as string;
    try {
      const agendamentos = await Agendamento
        .aggregate()
        .lookup({
          from: "procedimentos",
          localField: "idProcedimento",
          foreignField: "_id",
          as: "procedimento",
        })
        .match({
          idUsuario: Types.ObjectId(idUsuario),
        })
        .unwind('procedimento')
        .project({
          "__v": 0,
          "procedimento.__v": 0,
          "idUsuario": 0,
        })
        .sort({
          data: -1
        })

      return response.json(agendamentos)
    }
    catch (erro) {
      console.log(erro);
      return response.status(400).send()
    }
  }

  async search(request: Request, response: Response) {
    const idUsuario = request.body.idUsuario as string;
    let cliente = request.query.cliente as string;
    let data = request.query.data as string;
    try {
      cliente = cliente ? cliente : "";
      let match;
      if (data) {
        let date = new Date(data);
        date.setHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        date.setUTCHours(0);
        match = {
          cliente: {
            $regex: cliente,
            $options: "i",
          },
          idUsuario: Types.ObjectId(idUsuario),
          data: date
        }
      }
      else {
        match = {
          cliente: {
            $regex: cliente,
            $options: "i",
          },
          idUsuario: Types.ObjectId(idUsuario),
        }
      }
      console.log(match)
      const agendamentos = await Agendamento
        .aggregate()
        .lookup({
          from: "procedimentos",
          localField: "idProcedimento",
          foreignField: "_id",
          as: "procedimento",
        })
        .match(match)
        .unwind('procedimento')
        .project({
          "__v": 0,
          "procedimento.__v": 0,
          "idUsuario": 0,
        })
        .sort({
          data: -1
        })

      return response.json(agendamentos)
    }
    catch (erro) {
      console.log(erro);
      return response.status(400).send()
    }
  }

  async listIntervalos(request: Request, response: Response) {
    try {
      const idUsuario = request.body.idUsuario as string;
      const data = request.query.data as unknown as Date;
      const agendamentos = await Agendamento.find({ data, idUsuario }).select({ horaInicio: 1, horaFim: 1, _id: 0, })
      return response.json(agendamentos);
    }
    catch (erro) {
      console.log(erro)
      return response.status(400).send();
    }
  }
}