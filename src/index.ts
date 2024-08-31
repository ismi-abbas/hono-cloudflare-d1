import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { posts, users } from "./db";

export interface Env {
  DB: D1Database;
}
const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hono API Demo</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 class="text-3xl font-bold mb-6 text-blue-600 text-center">HELLO FROM HONO 🤗</h1>
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-3 text-gray-700">Available Routes</h2>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><span class="font-medium">GET /posts</span> - get all posts</li>
                    <li><span class="font-medium">POST /post</span> - create post</li>
                    <li><span class="font-medium">POST /user</span> - create user</li>
                </ul>
            </div>
            <form action="/post" method="POST" class="mb-6">
                <h3 class="text-lg font-semibold mb-3 text-gray-700">Create a Post</h3>
                <div class="mb-4">
                    <label for="content" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                    <input type="text" id="content" name="content" class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div class="mb-4">
                    <label for="userId" class="block text-sm font-medium text-gray-700 mb-1">User Id</label>
                    <input type="number" id="userId" name="userId" class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Create Post</button>
            </form>
            <form action="/user" method="POST">
                <h3 class="text-lg font-semibold mb-3 text-gray-700">Create a User</h3>
                <div class="mb-4">
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" id="name" name="name" class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" name="email" class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <button type="submit" class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Create User</button>
            </form>
        </div>
    </body>
    </html>`;
  return c.html(html);
});

app.get("/posts", async (c) => {
  const db = drizzle(c.env.DB);
  const res = await db.select().from(posts);

  if (res.length === 0) {
    return c.json({ data: "no posts" });
  }

  return c.json(res);
});

app.post("/post", async (c) => {
  const body = await c.req.formData();
  const content = body.get("content");
  const userId = body.get("userId");

  const db = drizzle(c.env.DB);

  await db.insert(posts).values({
    content: content?.toString(),
    userId: Number(userId),
  });

  return c.redirect("/");
});

app.post("/user", async (c) => {
  const body = await c.req.formData();
  const name = body.get("name");
  const email = body.get("email");

  const db = drizzle(c.env.DB);
  await db.insert(users).values({
    name: name?.toString(),
    email: email?.toString(),
  });

  return c.redirect("/");
});

export default app;
