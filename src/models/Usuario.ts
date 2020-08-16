import mongoose, { Document } from 'mongoose';

export interface IUsuario extends Document{
  nomeUsuario: string,  
  senha: string,
  nome: string,
}

const Usuario = new mongoose.Schema({
  nomeUsuario: {
    type: String,
    required: true,
    unique: true,
  },
  senha:{
    type: String,
    required: true,
    select: false,
  },
  nome:{
    type: String,
    required: true
  }
});

export default mongoose.model<IUsuario>("Usuario", Usuario);