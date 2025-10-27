// Importamos las dependencias necesarias desde Express y otros módulos del proyecto
import { Router } from 'express';
import { validate } from '../../middlewares/validator.middleware.js';
import * as MensajeService from '../services/mensaje.service.js';

import socketGateway from '../../websocket/socket.geteway.js'; 

// Creamos una nueva instancia del enrutador de Express
const router = Router();

// Inicializamos Passport para manejar la autenticación con JWT
router.use(initializePassport());

/**
 * ===========================================================
 * RUTA: POST '/'
 * Descripción: Envía un nuevo mensaje en un chat determinado.
 * Middleware:
 *  - validate(sendMessageSchema): valida que los datos del mensaje sean correctos.
 *  - authenticateJwt: verifica que el usuario tenga un token JWT válido.
 * -----------------------------------------------------------
 * Si el mensaje se envía correctamente, también se emite por
 * WebSocket para que otros usuarios del chat lo reciban en tiempo real.
 * ===========================================================
 */
router.post('/', validate(sendMessageSchema), authenticateJwt, async (req, res) => {
  try {
    // Enviamos el mensaje utilizando el servicio correspondiente
    const message = await MensajeService.sendMessage(req.body, req.user.id);

    // Intentamos emitir el mensaje a través de sockets (si el gateway está disponible)
    try {
      if (socketGateway && socketGateway.io) {
        socketGateway.io
          .to(String(req.body.chatId))
          .emit('new_message', { ...message, authorId: req.user.id });
      }
    } catch (e) {
      // Si falla la emisión del socket, solo se muestra una advertencia
      // No interrumpe la respuesta HTTP
      console.warn('Fallo al emitir mensaje por socket:', e);
    }

    // Respondemos al cliente confirmando el envío
    res.status(201).json({ ok: true, data: message });
  } catch (err) {
    // Si ocurre un error, devolvemos un estado 400 o el que indique el error
    const status = err.status || 400;
    res.status(status).json({
      ok: false,
      message: err.message || 'Error al enviar el mensaje',
      error: err,
    });
  }
});

/**
 * ===========================================================
 * RUTA: GET '/chat/:chatId'
 * Descripción: Obtiene todos los mensajes de un chat específico.
 * Middleware:
 *  - validate(queryMessagesSchema, 'query'): valida los parámetros de búsqueda.
 *  - authenticateJwt: asegura que el usuario esté autenticado.
 * -----------------------------------------------------------
 * Retorna la lista de mensajes correspondientes al chat solicitado.
 * ===========================================================
 */
router.get('/chat/:chatId', validate(queryMessagesSchema, 'query'), authenticateJwt, async (req, res) => {
  try {
    const messages = await MensajeService.getMessagesByChat(req.params.chatId, req.query);
    res.status(200).json({ ok: true, data: messages });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({
      ok: false,
      message: err.message || 'Error al obtener los mensajes',
      error: err,
    });
  }
});

/**
 * ===========================================================
 * RUTA: DELETE '/:id'
 * Descripción: Elimina un mensaje específico por su ID.
 * Middleware:
 *  - authenticateJwt: verifica que el usuario tenga sesión activa.
 * -----------------------------------------------------------
 * Solo el autor del mensaje o un administrador puede eliminarlo.
 * ===========================================================
 */
router.delete('/:id', authenticateJwt, async (req, res) => {
  try {
    // Se verifica si el usuario tiene rol de administrador
    const isAdmin = req.user?.role === 'admin';

    // Se intenta eliminar el mensaje a través del servicio
    await MensajeService.deleteMessage(req.params.id, req.user.id, isAdmin);

    // Si todo sale bien, se confirma la eliminación
    res.status(200).json({ ok: true, message: 'Mensaje eliminado correctamente' });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({
      ok: false,
      message: err.message || 'Error al eliminar el mensaje',
      error: err,
    });
  }
});

// Exportamos el router para que pueda ser utilizado en el resto de la aplicación
export default router;
