INSERT INTO users (user_id, created_at)
VALUES ('user1', now());
INSERT INTO users (user_id, created_at)
VALUES ('user2', now());

INSERT INTO user_profiles (user_id, last_name, first_name, nickname, email)
VALUES ('user1', 'Doe', 'John', 'JD', 'john.doe@example.com');
INSERT INTO user_profiles (user_id, last_name, first_name, nickname, email)
VALUES ('user2', 'Doe', 'John', 'JD', 'john.doe@example.com');