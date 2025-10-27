import { request, response } from "express";
import AppDataSource from "../provider/datasource-provider.js";
import { UserEntity } from "../module/entity/User-entity.js";

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

