create table "public"."user_profiles" (
    "user_id" character varying(255) not null,
    "last_name" character varying(255),
    "first_name" character varying(255),
    "nickname" character varying(255),
    "email" character varying(255)
);


create table "public"."users" (
    "user_id" character varying(255) not null,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);


CREATE UNIQUE INDEX user_profiles_pkey ON public.user_profiles USING btree (user_id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id);

alter table "public"."user_profiles" add constraint "user_profiles_pkey" PRIMARY KEY using index "user_profiles_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."user_profiles" add constraint "fk_user_profiles_user_id" FOREIGN KEY (user_id) REFERENCES users(user_id) not valid;

alter table "public"."user_profiles" validate constraint "fk_user_profiles_user_id";


