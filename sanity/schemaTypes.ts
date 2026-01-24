import { type SchemaTypeDefinition } from "sanity";

import category from "./schema/category";
import post from "./schema/post";
import author from "./schema/author";

export const schema: { types: SchemaTypeDefinition[] } = {
	types: [post, author, category],
};
