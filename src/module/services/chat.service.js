// ===========================================================
// SERVICIO: chat.service.js
// Este archivo contiene la lógica de negocio relacionada con
// los chats: creación, búsqueda, unión y salida de usuarios.
// Se comunica directamente con la base de datos mediante los
// repositorios configurados en AppDatasource.
// ===========================================================

import AppDatasource from '../../provider/datasource-provider.js';

// Repositorios para interactuar con las tablas Chat y Participa
const chatRepo = AppDatasource.getRepository('Chat');
const participaRepo = AppDatasource.getRepository('Participa');

/**
 * ===========================================================
 * FUNCIÓN: createChat
 * Descripción:
 *  Crea un nuevo chat y registra automáticamente al creador
 *  como participante con rol "owner". Todo se ejecuta dentro
 *  de una transacción para asegurar consistencia.
 * Parámetros:
 *  - payload: datos del chat a crear (nombre, tipo, etc.)
 *  - ownerId: ID del usuario que crea el chat
 * Retorna:
 *  - El chat creado.
 * ===========================================================
 */
export const createChat = async (payload, ownerId) => {
  return await AppDatasource.manager.transaction(async (manager) => {
    // Se crea el chat
    const chat = await manager.save('Chat', { ...payload, ownerId });

    // Se registra la participación del creador
    await manager.save('Participa', {
      chatId: chat.id,
      userId: ownerId,
      role: 'owner',
    });

    return chat;
  });
};

/**
 * ===========================================================
 * FUNCIÓN: findChats
 * Descripción:
 *  Obtiene una lista de chats con soporte de paginación.
 *  También devuelve la cantidad total de chats.
 * Parámetros:
 *  - page: número de página (por defecto 1)
 *  - limit: cantidad de resultados por página (por defecto 20)
 * Retorna:
 *  - Un objeto con los items (chats), total, página y límite.
 * ===========================================================
 */
export const findChats = async ({ page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;

  const [items, total] = await chatRepo.findAndCount({
    skip,
    take: limit,
    order: { id: 'DESC' },
  });

  return { items, total, page, limit };
};

/**
 * ===========================================================
 * FUNCIÓN: findChatById
 * Descripción:
 *  Busca un chat por su ID. Puede incluir relaciones como
 *  participantes y mensajes si se solicita.
 * Parámetros:
 *  - id: ID del chat a buscar
 *  - withRelations: booleano que indica si se incluyen relaciones
 * Retorna:
 *  - El chat encontrado o null si no existe.
 * ===========================================================
 */
export const findChatById = async (id, withRelations = false) => {
  if (withRelations) {
    return await chatRepo.findOne({
      where: { id },
      relations: ['participantes', 'mensajes'],
    });
  }

  return await chatRepo.findOne({ where: { id } });
};

/**
 * ===========================================================
 * FUNCIÓN: joinChat
 * Descripción:
 *  Permite a un usuario unirse a un chat si no forma parte ya.
 *  Si el chat no existe o el usuario ya participa, lanza un error.
 * Parámetros:
 *  - chatId: ID del chat
 *  - userId: ID del usuario
 * Retorna:
 *  - La participación creada.
 * ===========================================================
 */
export const joinChat = async (chatId, userId) => {
  const chat = await chatRepo.findOne({ where: { id: chatId } });
  if (!chat) throw { status: 404, message: 'Chat no encontrado' };

  const exists = await participaRepo.findOne({ where: { chatId, userId } });
  if (exists) throw { status: 409, message: 'El usuario ya participa en este chat' };

  const participation = await participaRepo.save({
    chatId,
    userId,
    role: 'member',
  });

  return participation;
};

/**
 * ===========================================================
 * FUNCIÓN: leaveChat
 * Descripción:
 *  Permite a un usuario abandonar un chat.
 *  Si no participaba en él, lanza un error 404.
 * Parámetros:
 *  - chatId: ID del chat
 *  - userId: ID del usuario
 * Retorna:
 *  - true si se eliminó correctamente la participación.
 * ===========================================================
 */
export const leaveChat = async (chatId, userId) => {
  const res = await participaRepo.delete({ chatId, userId });

  if (res.affected === 0)
    throw { status: 404, message: 'Participación no encontrada' };

  return true;
};
