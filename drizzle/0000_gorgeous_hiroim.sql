CREATE TABLE "followers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "followers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255) NOT NULL,
	"followingId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "images" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"postId" integer NOT NULL,
	"storagePath" varchar(255) NOT NULL,
	"publicUrl" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "likes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255) NOT NULL,
	"postId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" varchar(255) NOT NULL,
	"postId" integer,
	"content" integer NOT NULL,
	"isComment" boolean NOT NULL,
	"likeCount" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "images" ADD CONSTRAINT "images_postId_posts_postId_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("postId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_posts_postId_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("postId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "userIdIndexFollowing" ON "followers" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "userIdIndex" ON "posts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "postIdIndex" ON "posts" USING btree ("postId");