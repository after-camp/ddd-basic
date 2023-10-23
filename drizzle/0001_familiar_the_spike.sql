CREATE TABLE IF NOT EXISTS "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"price" integer,
	"stock" integer,
	"created_at" timestamp DEFAULT now()
);
