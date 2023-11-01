ALTER TABLE "order_items" ADD COLUMN "product_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" DROP COLUMN IF EXISTS "option";