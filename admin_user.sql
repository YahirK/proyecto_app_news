INSERT INTO `profiles` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES (1, 'Admin', NOW(), NOW());

INSERT INTO `users` (`profile_id`, `nombre`, `apellidos`, `nick`, `correo`, `contraseña`, `activo`, `UserAlta`, `FechaAlta`, `createdAt`, `updatedAt`) VALUES (1, 'Admin', 'User', 'admin', 'admin@example.com', 'password', 1, 'System', NOW(), NOW(), NOW());
