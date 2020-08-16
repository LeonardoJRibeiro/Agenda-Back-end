import {Router} from 'express';
import AgendamentoController from './controllers/AgendamentoController';
import ProcedimentoController from './controllers/ProcedimentoController';
import UsuarioController from './controllers/UsuarioController';
import auth from './midllewares/Auth';

const routes = Router();
const agendamentoController = new AgendamentoController();
const procedimentoController = new ProcedimentoController();
const usuarioController = new UsuarioController();

routes.post('/agendamento', auth, agendamentoController.create);
routes.get('/agendamento', auth, agendamentoController.index);
routes.get('/agendamento/intervalo', auth, agendamentoController.listIntervalos);

routes.post('/procedimento', auth, procedimentoController.create);
routes.get('/procedimento', auth, procedimentoController.index);


routes.post('/usuario', usuarioController.create)
routes.post('/usuario/login', usuarioController.login)
routes.get('/usuario/loginPorToken', auth, usuarioController.loginPorToken)

export default routes;