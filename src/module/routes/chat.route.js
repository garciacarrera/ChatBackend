// ===========================================================
// RUTAS DE CHAT
// Este archivo define las rutas relacionadas con la creación,
// consulta y gestión de chats dentro de la aplicación.
// ===========================================================

import { Router } from 'express';
import { validate } from '../middlewares/validator.middleware.js';
import { initializePassport, authenticateJwt } from '../middlewares/passport-jwt.middleware.js';
import * as ChatService from '../services/chat.service.js';
import { chatController } from '../controllers/chat.controller.js';

// Creamos una instancia del enrutador de Express
const router = Router();

// Inicializamos Passport (por seguridad, aunque ya debería llamarse una vez en el inicio de la app)
router.use(initializePassport());

/**
 * ===========================================================
 * RUTA: POST '/'
 * Descripción: Crea un nuevo chat.
 * Middleware:
 *  - validate(createChatSchema): valida que el cuerpo de la petición tenga los datos correctos.
 *  - authenticateJwt: verifica que el usuario esté autenticado.
 * -----------------------------------------------------------
 * Retorna el chat recién creado.
 * ===========================================================
 */
router.post('/', validate(createChatSchema), authenticateJwt, async (req, res) => {
  try {
    const chat = await ChatService.createChat(req.body, req.user.id);
    res.status(201).json({ ok: true, data: chat });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({
      ok: false,
      message: err.message || 'Error al crear el chat',
      error: err,
    });
  }
});

/**
 * ===========================================================
 * RUTA: GET '/'
 * Descripción: Lista todos los chats con soporte de paginación.
 * Middleware:
 *  - validate(queryChatSchema, 'query'): valida los parámetros de consulta.
 *  - authenticateJwt: asegura que el usuario tenga sesión activa.
 * -----------------------------------------------------------
 * Devuelve una lista de chats (paginada si se especifican los parámetros).
 * ===========================================================
 */
router.get('/', validate(queryChatSchema, 'query'), authenticateJwt, async (req, res) => {
  try {
    const data = await ChatService.findChats(req.query);
    res.status(200).json({ ok: true, data });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Error al listar los chats',
      error: err,
    });
  }
});

/**
 * ===========================================================
 * RUTA: GET '/:id'
 * Descripción: Obtiene la información de un chat específico por su ID.
 * Middleware:
 *  - authenticateJwt: requiere autenticación del usuario.
 * -----------------------------------------------------------
 * Si el chat no existe, devuelve un error 404.
 * Se puede incluir o no la lista de participantes según el parámetro 'withParticipants'.
 * ===========================================================
 */
router.get('/:id', authenticateJwt, async (req, res) => {
  try {
    const includeParticipants =
      req.query.withParticipants === 'true' || req.query.withParticipants === true;

    const chat = await ChatService.findChatById(req.params.id, includeParticipants);

    if (!chat)
      return res.status(404).json({ ok: false, message: 'Chat no encontrado' });

    res.status(200).json({ ok: true, data: chat });
  } catch (err) {
    res.status(500).json({
      ok: false,
      message: 'Error al obtener el chat',
      error: err,
    });
  }
});

/**
 * ===========================================================
 * RUTA: POST '/:id/join'
 * Descripción: Permite a un usuario unirse a un chat existente.
 * Middleware:
 *  - authenticateJwt: requiere que el usuario esté autenticado.
 * -----------------------------------------------------------
 * Devuelve los datos de la participación creada.
 * ===========================================================
 */
router.post('/:id/join', authenticateJwt, async (req, res) => {
  try {
    const participation = await ChatService.joinChat(req.params.id, req.user.id);
    res.status(201).json({ ok: true, data: participation });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({
      ok: false,
      message: err.message || 'Error al unirse al chat',
      error: err,
    });
  }
});

/**
 * ===========================================================
 * RUTA: POST '/:id/leave'
 * Descripción: Permite que un usuario abandone un chat en el que está participando.
 * Middleware:
 *  - authenticateJwt: requiere autenticación.
 * -----------------------------------------------------------
 * Si la salida es exitosa, devuelve un mensaje de confirmación.
 * ===========================================================
 */
router.post('/:id/leave', authenticateJwt, async (req, res) => {
  try {
    await ChatService.leaveChat(req.params.id, req.user.id);
    res.status(200).json({ ok: true, message: 'Has salido del chat' });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({
      ok: false,
      message: err.message || 'Error al salir del chat',
      error: err,
    });
  }
});

// Exportamos el enrutador para que pueda ser usado en el resto del proyecto
export default router;
