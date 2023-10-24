ALTER TABLE "brands" ADD CONSTRAINT "brands_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_name_unique" UNIQUE("name");