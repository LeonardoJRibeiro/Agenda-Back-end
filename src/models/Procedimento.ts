import mongoose from 'mongoose';
import { IUsuario } from './Usuario';

export interface IProcedimento extends mongoose.Document{
  descricao: string,
  duracao: number,
  idUsuario: IUsuario['_id'];
}

const Procedimento = new mongoose.Schema({
  descricao :{
    type: String,
    required: true
  },
  duracao:{
    type: Number,
    required: true,
  },
  idUsuario: {
    type: mongoose.Types.ObjectId,
    ref: "Usuarios",
    required: true,
  },
})

export default mongoose.model<IProcedimento>("Procedimento", Procedimento);