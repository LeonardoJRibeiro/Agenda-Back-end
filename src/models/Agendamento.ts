import mongoose from 'mongoose';
import { IProcedimento } from './Procedimento';
import { IUsuario } from './Usuario';

export interface IAgendamento extends mongoose.Document{
  cliente: string,
  data: Date,
  horaInicio: number,
  horaFim: number,
  idProcedimento: IProcedimento['_id'],
  idUsuario: IUsuario['_id'],
}

const Agendamento = new mongoose.Schema({
  cliente:{
    type: String,
    required: true,
  },
  data: {
    type: Date,
    required: true,
  },
  horaInicio:{
    type: Number,
    required: true,
  },
  horaFim:{
    type: Number,
    required: true,
  },
  idProcedimento: {
    type: mongoose.Types.ObjectId,
    ref: "Procedimentos",
    required: true,
  },
  idUsuario: {
    type: mongoose.Types.ObjectId,
    ref: "Usuarios",
    required: true,
  },
  
});

export default mongoose.model<IAgendamento>("Agendamento", Agendamento);