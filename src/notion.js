import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();
const notion = new Client({
    auth: process.env.NOTION_KEY,
});
const blockId = process.env.NOTION_ID_DB;

// Выводит заголовки блоков
// (async () => {
//     const response = await notion.databases.query({ database_id: blockId });
//     console.log(response.results.forEach((item) => console.log(item.properties.Name.title[0].text.content)));
// })();

export const createNewGroup = async (text) => {
    try {
        const response = await notion.pages.create({
            parent: { database_id: blockId },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: text,
                            },
                        },
                    ],
                },
                Status: {
                    status: {
                        name: "In progress",
                    },
                },
                "Assigned To": {
                    people: [
                        {
                            object: "user",
                            id: "c2f20311-9e54-4d11-8c79-7398424ae41e",
                        },
                    ],
                },
            },
        });
        console.log(response);
        return response;
    } catch (error) {
        console.error("Error fetching database:", error);
    }
};
