// data/mockData.js
let profiles = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Contribuidor" },
];

let users = [
  {
    id: 1,
    profile_id: 1, // Administrador
    nombres: "Admin",
    apellidos: "Principal",
    nick: "AdminUser",
    correo: "admin@correo.com",
    contraseña: "hashed_password_admin", // En un caso real, esto estaría hasheado
    activo: true,
  },
  {
    id: 2,
    profile_id: 2, // Contribuidor
    nombres: "Juan",
    apellidos: "Martinez",
    nick: "JuanXG",
    correo: "juan123@gmail.com",
    contraseña: "hashed_password_user", // En un caso real, esto estaría hasheado
    activo: true,
  }
];

let states = [
  { id: 1, nombre: "Yucatán", abreviacion: "YUC", activo: true },
  { id: 2, nombre: "Quintana Roo", abreviacion: "QROO", activo: true },
];

let categories = [
  { id: 1, nombre: "Farandula", descripcion: "Todo acerca del mundo del espectaculo", activo: true },
  { id: 2, nombre: "Deportes", descripcion: "Noticias deportivas nacionales e internacionales", activo: true },
];

let news = [
  {
    id: 1,
    categoria_id: 2,
    estado_id: 1,
    usuario_id: 2,
    titulo: "Leones de Yucatán ganan la serie",
    fecha_publicacion: "2025-10-08",
    description: "El equipo local se impuso en un emocionante partido...",
    image: "base64_string_placeholder",
    // Para la lógica de aprobación, agregamos un estado
    // Valores posibles: 'pendiente', 'aprobada', 'rechazada'
    status: 'aprobada', 
    activo: true,
  }
];

module.exports = { profiles, users, states, categories, news };