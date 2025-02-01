#Aplicación de Reseñas de Libros 📱
Esta aplicación móvil permite a los usuarios agregar libros, escribir reseñas con una valoración del 1 al 10, gestionar sus propias reseñas y consultar las reseñas de libros específicos. Desarrollada en Ionic con un web service y una base de datos, incluye funcionalidades de autenticación y seguridad.

Desarrollador: Führer
GitHub: A&D Producciones

🚀 Funcionalidades Principales
📖 Gestión de Libros
Agregar un nuevo libro: Los usuarios pueden registrar nuevos libros en la base de datos.
Listar todos los libros: Se muestra una lista de libros disponibles.
Ver detalles de un libro: Incluye las reseñas y la valoración promedio.
Opciones para cada libro:
📜 Reseñas: Dirige a la lista de reseñas del libro.
✏️ Editar: Permite modificar los datos del libro.
🗑️ Eliminar: Borra el libro de la base de datos.
Valoración promedio: Se muestra con una estrella del 1 al 10 según la media de las reseñas.
✍️ Gestión de Reseñas
Agregar una nueva reseña para un libro existente.
Cada reseña incluye:
📅 Fecha de creación.
⭐ Valoración del 1 al 10.
💬 Comentario del usuario.
✏️ Editar: Modificar la reseña.
🗑️ Eliminar: Borrar la reseña.
🔐 Autenticación y Seguridad
Registro de usuarios con validaciones:
La cédula debe ser única.
Confirmación de clave obligatoria.
Inicio de sesión con restricciones:
Máximo 3 intentos fallidos antes de bloquear la cuenta temporalmente.
Bloqueo del usuario por un tiempo determinado tras superar los intentos fallidos.
Recuperación de contraseña:
El usuario ingresa su correo electrónico registrado.
Si el correo es válido, se envía directamente la contraseña en texto plano al correo electrónico.
🍔 Menú de Navegación (Hamburguesa)
Visualización del nombre del usuario en el encabezado del menú.
Acceso a todos los libros registrados en la aplicación.
Acceso a todas las reseñas, sin importar el libro al que pertenecen.
Cerrar sesión: Opción para cerrar sesión y volver a la pantalla de inicio de sesión.
👤 Perfil de Usuario
Visualización y edición de datos personales.
Se pueden modificar todos los datos excepto la cédula.
🛠️ Tecnologías Utilizadas
Frontend: Ionic + Angular
Backend: Web service desarrollado en [tu tecnología elegida, ej. Node.js con Express, Laravel, etc.]
Base de datos: MySQL / PostgreSQL / Firebase (según tu implementación)
📷 Video Demostrativo
El video demostrativo se encuentra en el repositorio de GitHub:
🔗 Libros Final - Video
