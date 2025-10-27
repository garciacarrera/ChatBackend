/**
 * ======================================================
 * CONTROLADOR: ChatController
 * ======================================================
 * Este controlador gestiona todas las operaciones relacionadas
 * con los chats dentro de la aplicación, incluyendo creación,
 * consulta, unión y salida de usuarios de un chat.
 * 
 * Funcionalidades principales:
 * - Crear un nuevo chat.
 * - Listar todos los chats existentes.
 * - Buscar un chat específico por ID.
 * - Permitir que un usuario se una a un chat.
 * - Permitir que un usuario abandone un chat.
 * 
 * Dependencias:
 * - Express (para manejar las solicitudes HTTP).
 * - AppDatasource (conexión principal a la base de datos).
 * - Repositorios de Chat y Participa.
 */

import { request, response } from 'express';
import AppDatasource from '../../provider/datasource-provider.js';

// Repositorio principal para acceder a la entidad "Chat"
const repo = AppDatasource.getRepository('Chat');

// Repositorio secundario para gestionar la participación de usuarios en chats
const participaRepo = AppDatasource.getRepository('Participa');

/**
 * ======================================================
 * Crear un nuevo chat
 * ======================================================
 * Endpoint: POST /chats
 * Requiere autenticación (usa req.user.id)
 * 
 * - Recibe el contenido del chat en el body (payload).
 * - Asigna el usuario autenticado como propietario del chat.
 * - Guarda el registro en la base de datos.
 */
const create = async (req = request, res = response) => {
  const payload = req.body;
  try {
    // (Pendiente) Validar el payload con un DTO de Joi antes de guardar.
    const chat = await repo.save({ ...payload, ownerId: req.user.id });

    // Respuesta exitosa
    res.status(201).json({ ok: true, data: chat });
  } catch (error) {
    // Error en la creación o validación
    res.status(400).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Obtener todos los chats
 * ======================================================
 * Endpoint: GET /chats
 * 
 * - Devuelve la lista completa de chats existentes.
 * - Puede extenderse en el futuro con filtros o paginación.
 */
const findAll = async (req = request, res = response) => {
  try {
    const chats = await repo.find();
    res.status(200).json({ ok: true, data: chats });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Obtener un chat por su ID
 * ======================================================
 * Endpoint: GET /chats/:id
 * 
 * - Busca un chat específico mediante su ID.
 * - Si no existe, devuelve un error 404.
 */
const findOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const chat = await repo.findOne({ where: { id } });
    if (!chat) return res.status(404).json({ ok: false, message: 'Chat not found' });

    res.status(200).json({ ok: true, data: chat });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Unirse a un chat existente
 * ======================================================
 * Endpoint: POST /chats/:id/join
 * Requiere autenticación
 * 
 * - Crea una nueva participación del usuario en el chat.
 * - Por defecto, el rol asignado es 'member'.
 * - Si el usuario ya está en el chat, podría lanzar error.
 */
const join = async (req = request, res = response) => {
  const { id: chatId } = req.params;
  try {
    // Guardar la relación usuario-chat en la tabla Participa
    const participation = await participaRepo.save({
      chatId,
      userId: req.user.id,
      role: 'member'
    });

    res.status(201).json({ ok: true, data: participation });
  } catch (error) {
    res.status(400).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Salir de un chat
 * ======================================================
 * Endpoint: DELETE /chats/:id/leave
 * Requiere autenticación
 * 
 * - Elimina el registro del usuario en la tabla de participaciones.
 * - Si el usuario no participa en el chat, no lanza error.
 */
const leave = async (req = request, res = response) => {
  const { id: chatId } = req.params;
  try {
    await participaRepo.delete({ chatId, userId: req.user.id });
    res.status(200).json({ ok: true, message: 'You have left the chat' });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

/**
 * ======================================================
 * Exportación del controlador
 * ======================================================
 * Se exportan todas las funciones para ser utilizadas
 * en las rutas del módulo de chats.
 */
export const chatController = { create, findAll, findOne, join, leave };
