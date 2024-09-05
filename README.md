Webgae: Una aplicación web para compartir archivos con Firebase
Webgae es una aplicación web sencilla que permite a los usuarios autenticados con Google crear y compartir carpetas de archivos utilizando Firebase Storage y Realtime Database.

Funcionalidades:
Autenticación con Google: Los usuarios deben iniciar sesión con su cuenta de Google para acceder a la aplicación.
Creación de carpetas: Cada usuario puede crear una carpeta personal para almacenar sus archivos.
Subida de archivos: Los usuarios pueden subir archivos a su carpeta.
Visualización de archivos: La aplicación muestra una lista de los archivos dentro de la carpeta, incluyendo su nombre, tipo y un enlace de descarga.
Descripción de la carpeta: Los usuarios pueden agregar y editar una descripción para su carpeta.
Cómo funciona:
Autenticación: La aplicación utiliza Firebase Authentication para gestionar el inicio de sesión con Google.
Almacenamiento de archivos: Los archivos se almacenan en Firebase Storage, un servicio de almacenamiento de archivos escalable y seguro.
Base de datos: La información de las carpetas (nombre, descripción, propietario) se almacena en Firebase Realtime Database, una base de datos NoSQL en tiempo real.
Interfaz de usuario: La aplicación utiliza HTML, CSS y JavaScript para crear una interfaz de usuario sencilla e intuitiva.
Instrucciones de uso:
Iniciar sesión: Haz clic en el botón "Entrar con Google" para iniciar sesión con tu cuenta de Google.
Crear una carpeta: Si aún no tienes una carpeta, haz clic en el botón "Crear carpeta".
Subir archivos: Dentro de tu carpeta, haz clic en el botón "Subir archivos" y selecciona los archivos que deseas subir.
Ver archivos: La lista de archivos se actualizará automáticamente para mostrar los archivos subidos. Haz clic en el enlace de descarga para descargar un archivo.
Editar la descripción: Haz clic en el texto de la descripción para editarla. Haz clic en el botón "Guardar Descripción" para guardar los cambios.
Cerrar sesión: Haz clic en el botón "Salir" para cerrar sesión.
Tecnologías utilizadas:
Firebase (Authentication, Storage, Realtime Database)
HTML
CSS
JavaScript
Notas:
Esta aplicación es un ejemplo básico y puede ser extendida con más funcionalidades.
Asegúrate de configurar tu proyecto de Firebase correctamente antes de utilizar la aplicación.
Contribuciones:
Las contribuciones son bienvenidas. Si encuentras algún error o quieres agregar nuevas funcionalidades, no dudes en enviar un pull request.
