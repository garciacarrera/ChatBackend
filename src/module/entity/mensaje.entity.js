import { EntitySchema } from "typeorm";

export const mensajeEntity = EntitySchema(
    {
        name: "Mensaje",
        tablename: "mensaje",
        columns: {
            id: {
                primary: true,
                type: 'int',
                generated: true
            },
            content: {
                type: 'varchar',
                nullable: true
            }
            // user:{
            //     type:'int',
            //     nullable:false
            // },
            // chat:{
            //     type:'int',
            //     nullable:false
            // }
        },
        relations: {
            user: {
                type: "many-to-one",
                target: "User",
                joinColumn: { name: "userId" },
                nullable: false,
                onDelete: "CASCADE",
                inverseSide: "mensajes"
            },
            chat: {
                type: "many-to-one",
                target: "Chat",
                joinColumn: { name: "chatId" },
                nullable: false,
                onDelete: "CASCADE",
                inverseSide: "mensajes"
            }
        }
    }
)