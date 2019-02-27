INSERT INTO users1 (name, email, password)
VALUES (${name}, ${email}, ${hash})

RETURNING id, name, email;