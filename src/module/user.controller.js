//import { request, response } from "express";
//import AppDataSource from "../provider/datasource-provider.js";
//import { UserEntity } from "../module/entity/User-entity.js";

/**
 * const create = async (req = request, res = response) => {  
    const user = req.body;

    try {
        // Obtener el repositorio dentro de la función (después de inicializar AppDataSource)
        const repository = AppDataSource.getRepository(UserEntity);
        const newuser = await repository.save(user);
        res.status(201).json(newuser);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const usercontroller = { create };
 */



import { UserEntity } from './entity/User-entity.js';
import { request, response } from "express";
import AppDataSource from "../provider/datasource-provider.js";
import jwt from 'jsonwebtoken';  
import bcrypt from 'bcrypt';    


export const registerUser = async (req, res) => {
  try {
    // Extraemos los campos enviados desde el cliente
    const { nombre, email, password } = req.body;

    // Verificamos si el usuario ya existe en la base de datos
    const userExistente = await UserEntity.findOne({ where: { email } });
    if (userExistente) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Encriptamos la contraseña con bcrypt
    // El segundo parámetro (10) indica el número de rondas de "sal"
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos la nueva instancia del usuario con la contraseña encriptada
    const nuevoUsuario = UserEntity.create({
      nombre,
      email,
      password: hashedPassword
    });

    // Guardamos el usuario en la base de datos
    await nuevoUsuario.save();

    // Respondemos con un mensaje y los datos del usuario (sin contraseña)
    res.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
      }
    });

  } catch (error) {
    // Capturamos y mostramos cualquier error inesperado
    res.status(500).json({
      mensaje: 'Error al registrar usuario',
      error: error.message
    });
  }
};



export const loginUser = async (req, res) => {
  try {
    // Extraemos credenciales del cuerpo de la petición
    const { email, password } = req.body;

    // Buscamos al usuario en la base de datos por su email
    const usuario = await UserEntity.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Comparamos la contraseña ingresada con la encriptada
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Si las credenciales son correctas, generamos un token JWT
    // El token incluirá el ID y email del usuario como "payload"
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET, // Clave secreta almacenada en .env
      { expiresIn: '2h' }     // Duración del token (2 horas)
    );

    // Enviamos la respuesta al cliente con el token generado
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token
    });

  } catch (error) {
    // Capturamos y devolvemos errores
    res.status(500).json({
      mensaje: 'Error al iniciar sesión',
      error: error.message
    });
  }
};


export const getUsers = async (req, res) => {
  try {
    // Consultamos todos los usuarios de la base de datos
    const usuarios = await UserEntity.find();

    // Eliminamos los campos sensibles (como la contraseña)
    const usuariosSinPassword = usuarios.map(user => ({
      id: user.id,
      nombre: user.nombre,
      email: user.email
    }));

    // Respondemos con la lista de usuarios
    res.status(200).json(usuariosSinPassword);

  } catch (error) {
    // Capturamos y mostramos errores
    res.status(500).json({
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });
  }
};



