# Proyecto Frontend - Sistema de Biblioteca

## Requisitos Previos

### 1. Instalación de Herramientas Necesarias
Antes de comenzar, asegúrate de tener instaladas las siguientes herramientas:

- **Node.js** (versión 17 o superior): Descárgalo e instálalo desde [nodejs.org](https://nodejs.org).
- **Angular CLI** (versión 18.2.12 o superior): Instálalo globalmente con el siguiente comando:
  ```bash
  npm install -g @angular/cli@18.2.12
  ```
### 2. Instalación de Dependencias
Una vez dentro del directorio del proyecto, instala las dependencias ejecutando:
```bash
npm install
```

## Configuración del Proyecto

### 1. Configuración del Backend
El frontend consume un microservicio desarrollado en Spring Boot. Asegúrate de que el backend esté configurado y corriendo en tu entorno local o en un servidor remoto. Sigue las instrucciones en el README del microservicio para levantarlo.

Por defecto, la URL base del backend es:
```
http://localhost:8080
```

Si la URL es diferente, actualiza el archivo de configuración en el frontend.

### 2. Actualizar la URL del Backend en el Frontend
En el proyecto Angular, ubica el archivo `environment.ts` en la carpeta `src/environments` y actualiza la propiedad `apiUrl`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
};
```

## Levantar el Proyecto

### 1. Servidor de Desarrollo
Inicia el servidor de desarrollo con el siguiente comando:
```bash
ng serve
```

El proyecto estará disponible en:
```
http://localhost:4200
```

### 2. Compilación para Producción
Para generar una versión optimizada para producción, ejecuta:
```bash
ng build --prod
```
Los archivos generados estarán disponibles en la carpeta `dist/<nombre-del-proyecto>`.

## Estructura del Proyecto

El proyecto incluye las siguientes páginas y funcionalidades:

### 1. Dashboard
- Visualiza el total de libros, autores y préstamos.

### 2. Gestión de Libros
- Agregar, editar, eliminar y listar libros.
- Formulario con validaciones reactivas.
- Operación para verificar la disponibilidad de un libro.

### 3. Gestión de Préstamos
- Listar todos los préstamos.
- Registrar un nuevo préstamo con validaciones reactivas.
- Operación para listar todos los préstamos de un libro específico.

### 4. Gestión de Autores
- Agregar, editar, eliminar y listar autores.
- Formulario con validaciones reactivas.

## Rutas Configuradas

- `/autor`: Gestión de autores.
- `/libro`: Gestión de libros.
- `/prestamo`: Gestión de préstamos.


## Manejo de Errores

En caso de que el backend regrese un error:
- Los errores serán mostrados en la interfaz mediante mensajes amigables.


