import { EntitySchema } from "typeorm";

const participaSchema = EntitySchema(
    {
        name: "Participa",
        tablename: "participa",
        columns: {
            id: {
                primary: true,
                type: 'int',
                generated: true
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
                inverseSide: "participa"
            },
            chat: {
                type: "many-to-one",
                target: "Chat",
                joinColumn: { name: "chatId" },
                nullable: false,
                onDelete: "CASCADE",
                inverseSide: "participa"
            }
        }
    }
)