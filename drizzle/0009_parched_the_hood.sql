CREATE TABLE IF NOT EXISTS "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"product_name" varchar NOT NULL,
	"product_price" real NOT NULL,
	"option" varchar,
	"order_state" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"receiver_name" varchar NOT NULL,
	"receiver_address" varchar NOT NULL,
	"receiver_phone" varchar NOT NULL
);
