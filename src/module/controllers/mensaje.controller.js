/**
 * ======================================================
 * CONTROLADOR: MensajeController
 * ======================================================
 * Este controlador gestiona las operaciones relacionadas
 * con los mensajes dentro de un chat, incluyendo el envío,
 * la obtención por chat y la eliminación de mensajes.
 *
 * Funcionalidades principales:
 * - Enviar un mensaje a un chat.
 * - Listar los mensajes de un chat específico.
 * - Eliminar un mensaje.
 *
 * Dependencias:
 * - Express (para manejo de solicitudes HTTP).
 * - AppDatasource (para acceso al repositorio de base de datos).
 * - socketGateway (para emitir eventos en tiempo real mediante WebSockets).
 */

import { request, response } from 'express';
import AppDatasource from '../../provider/datasource-provider.js';
import socketGateway from '../../websocket/socket.gateway.js'; // Gateway de WebSocket, expone la instancia io

// Repositorio para acceder a la entidad "Mensaje"
const repo = AppDatasource.getRepository('Mensaje');

/**
 * ======================================================
 * Enviar un mensaje a un chat
 * ======================================================
 * Endpoint: POST /mensajes
 * Requiere autenticación.
 *
 * - Valida el cuerpo de la solicitud (chatId, content).
 * - Crea un nuevo mensaje con el usuario autenticado como autor.
 * - Emite el mensaje en tiempo real al canal correspondiente usando WebSockets.
 * 
 * Ejemplo de payload:
 * {
 *   "chatId": 5,
 *   "content": "Hola, ¿cómo estás?"
 * }
 */
const send = async (req = request, res = response) => {
  const { chatId, content } = req.body;

  try {
    // (Pendiente) Validar con Joi: SendMessageDTO
    const message = await repo.save({
      chatId,
      content,
      authorId: req.user.id,
      createdAt: new Date()
    });

    // Emitir mensaje en tiempo real al canal del chat
    if (socketGateway && socketGateway.io) {
      socketGateway.io
        .to(String(chatId))
        .emit('new_message', { ...message, authorId: req.user.id });
    }

    res.status(201).json({ ok: true, data: message });
  } catch (error) {
    res.status(400).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Obtener todos los mensajes de un chat
 * ======================================================
 * Endpoint: GET /mensajes/:chatId
 * 
 * - Recupera todos los mensajes de un chat ordenados por fecha de creación (ASC).
 * - Permite renderizar conversaciones completas en el cliente.
 */
const findByChat = async (req = request, res = response) => {
  const { chatId } = req.params;

  try {
    const messages = await repo.find({
      where: { chatId },
      order: { createdAt: 'ASC' }
    });

    res.status(200).json({ ok: true, data: messages });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Eliminar un mensaje
 * ======================================================
 * Endpoint: DELETE /mensajes/:id
 * Requiere autenticación.
 *
 * - Elimina un mensaje de la base de datos según su ID.
 * - (En una versión avanzada) se podría validar si el usuario
 *   es el autor o tiene permisos de administrador antes de eliminar.
 */
const remove = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    await repo.delete(id);
    res.status(200).json({ ok: true, message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Exportación del controlador
 * ======================================================
 * Se exportan todas las funciones para ser utilizadas
 * dentro de las rutas del módulo de mensajes.
 */
export const mensajeController = { send, findByChat, remove };
