CREATE TABLE users (
  user_id VARCHAR(255) PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE user_profiles (
  user_id VARCHAR(255) PRIMARY KEY,
  last_name VARCHAR(255),
  first_name VARCHAR(255),
  nickname VARCHAR(255),
  email VARCHAR(255),
  CONSTRAINT fk_user_profiles_user_id
    FOREIGN KEY (user_id)
    REFERENCES users (user_id)
);