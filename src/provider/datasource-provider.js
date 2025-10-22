import { DataSource } from "typeorm";
import { envs } from "../configuration/envs.js";
import { UserEntity } from "../module/entity/User-entity.js";
import { MensajeEntity } from "../module/entity/Mensaje_entity.js";
import { PartiEntity } from "../module/entity/Participa_entity.js";
import { ChatEntity } from "../module/entity/Chat_entity.js";

const AppDataSource = new DataSource({
    type: "mysql",
    host: envs.DB_HOST,
    port: envs.DB_PORT, 
    username: envs.DB_USER,
    password: envs.DB_PASSWORD,
    database: envs.DB_NAME,
    synchronize: true,  
    logging: false,
    entities: [UserEntity, MensajeEntity, PartiEntity, ChatEntity],
})

export default AppDataSource;
