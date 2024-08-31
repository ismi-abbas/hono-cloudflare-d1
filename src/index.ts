import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { posts, users } from "./db";

export interface Env {
  DB: D1Database;
}
const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/posts", async (c) => {
  const db = drizzle(c.env.DB);
  const res = await db.select().from(posts);

  if (res.length === 0) {
    return c.json({ data: "no posts" });
  }

  return c.json({ data: res });
});

app.post("/post", async (c) => {
  const body = await c.req.json();

  const db = drizzle(c.env.DB);
  
  const res = await db.insert(posts).values({
    content: body.content,
    userId: body.userId,
  });

  return c.json({ data: res });
});

app.post("/user", async (c) => {
  const body = await c.req.json();

  const db = drizzle(c.env.DB);
  const res = await db.insert(users).values({
    name: body.name,
    email: body.email,
  });

  return c.json({ data: res });
});

export default app;
