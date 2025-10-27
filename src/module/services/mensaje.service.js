// ===========================================================
// SERVICIO: mensaje.service.js
// Este archivo contiene toda la lógica relacionada con el
// envío, obtención y eliminación de mensajes dentro de los chats.
// Se conecta directamente con la base de datos a través del
// proveedor de datos (AppDatasource).
// ===========================================================

import AppDatasource from '../../provider/datasource-provider.js';

// Repositorios que manejan las tablas de la base de datos
const mensajeRepo = AppDatasource.getRepository('Mensaje');
const participaRepo = AppDatasource.getRepository('Participa');
const chatRepo = AppDatasource.getRepository('Chat');

/**
 * ===========================================================
 * FUNCIÓN: sendMessage
 * Descripción:
 *  Envía un nuevo mensaje dentro de un chat existente.
 *  Antes de guardar, se valida que el chat exista y que el
 *  usuario sea participante del mismo.
 * Parámetros:
 *  - chatId: ID del chat donde se envía el mensaje
 *  - content: contenido del mensaje (texto, imagen, etc.)
 *  - type: tipo de mensaje (por ejemplo: 'text', 'image', etc.)
 *  - userId: ID del usuario que envía el mensaje
 * Retorna:
 *  - El mensaje recién creado.
 * ===========================================================
 */
export const sendMessage = async ({ chatId, content, type }, userId) => {
  // Verifica que el chat exista
  const chat = await chatRepo.findOne({ where: { id: chatId } });
  if (!chat) throw { status: 404, message: 'Chat no encontrado' };

  // Verifica que el usuario participe en el chat
  const participation = await participaRepo.findOne({ where: { chatId, userId } });
  if (!participation) throw { status: 403, message: 'El usuario no participa en este chat' };

  // Guarda el nuevo mensaje
  const message = await mensajeRepo.save({
    chatId,
    content,
    type,
    authorId: userId,
    createdAt: new Date()
  });

  // Se podría cargar la relación con el autor si la entidad lo define
  return message;
};

/**
 * ===========================================================
 * FUNCIÓN: getMessagesByChat
 * Descripción:
 *  Obtiene todos los mensajes de un chat específico, con soporte
 *  de paginación y orden (ascendente o descendente).
 * Parámetros:
 *  - chatId: ID del chat del que se quieren obtener los mensajes
 *  - page: número de página (por defecto 1)
 *  - limit: cantidad de mensajes por página (por defecto 50)
 *  - order: 'asc' o 'desc' para definir el orden de los mensajes
 * Retorna:
 *  - Un array con los mensajes del chat.
 * ===========================================================
 */
export const getMessagesByChat = async (chatId, { page = 1, limit = 50, order = 'asc' }) => {
  const skip = (page - 1) * limit;

  const messages = await mensajeRepo.find({
    where: { chatId },
    order: { createdAt: order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
    skip,
    take: limit,
    relations: ['author'] // Carga la relación con el autor si está definida
  });

  return messages;
};

/**
 * ===========================================================
 * FUNCIÓN: deleteMessage
 * Descripción:
 *  Elimina un mensaje determinado. Solo el autor o un administrador
 *  tienen permiso para hacerlo.
 * Parámetros:
 *  - messageId: ID del mensaje a eliminar
 *  - userId: ID del usuario que intenta eliminarlo
 *  - isAdmin: booleano que indica si el usuario tiene rol administrador
 * Retorna:
 *  - true si la eliminación fue exitosa.
 * ===========================================================
 */
export const deleteMessage = async (messageId, userId, isAdmin = false) => {
  // Solo el autor o un admin pueden eliminar el mensaje
  const message = await mensajeRepo.findOne({ where: { id: messageId } });
  if (!message) throw { status: 404, message: 'Mensaje no encontrado' };

  if (message.authorId !== userId && !isAdmin)
    throw { status: 403, message: 'No tienes permiso para eliminar este mensaje' };

  await mensajeRepo.delete(messageId);
  return true;
};
