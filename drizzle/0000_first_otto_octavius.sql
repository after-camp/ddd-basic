CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(15),
	"email" varchar,
	"password" varchar(100),
	"phone" varchar(20)
);
