# 🚀 Documentación del Proyecto: Arquitectura Hexagonal con Node.js + TypeScript + Express

Bienvenido al proyecto estructurado con **Node.js**, **TypeScript** y **Express**, aplicando los principios **SOLID** y la **Arquitectura Hexagonal**. Esta documentación está diseñada para ayudarte a entender cada parte del proyecto y trabajar de forma organizada y escalable.

<div align="center">
  <a href="https://nodejs.org/en" target="blank"><img src="https://images-cdn.openxcell.com/wp-content/uploads/2024/07/25090553/nodejs-inner.webp" width="200" alt="NodeJS Logo" />
  </a>
  <a href="https://www.typescriptlang.org/" target="blank"><img src="https://www.vikingsoftware.com/wp-content/uploads/2024/02/TypeScript.png" width="200" alt="Typescript Logo"/>
  </a>
  <a href="https://www.typescriptlang.org/" target="blank"><img src="https://www.guayerd.com/wp-content/uploads//2021/04/expressjs-logo.svg" width="200" alt="Express Logo"/>
  </a>
</div>

---

## 📁 Estructura de Carpetas

```plaintext
src/
├── application/
│   ├── services/
│   └── use-cases/
├── common/
│   ├── config/
│   ├── data/
│   ├── errors/
│   └── types/
├── domain/
│   ├── entities/
│   ├── enums/
│   ├── interfaces/
│   └── ports/
│       ├── primary/
│       └── secondary/
├── infrastructure/
│   ├── adapters/
│   │   ├── drivens/
│   │   │   └── database/
│   │   │       ├── in-memory/
│   │   │       ├── models/
│   │   │       └── mongo/
│   │   │           ├── mappers/
│   │   │           ├── datasources/
│   │   │           ├── models/
│   │   │           └── repositories/
│   └── drivers/
│       └── http/
│           ├── controllers/
│           ├── middlewares/
│           ├── routes/
│           ├── validators/
│           ├── app.server.ts
│           └── routes.factory.ts
├── dependencies.ts
└── main.ts
```

---

## 📦 `application/`

Contiene la lógica de negocio que orquesta los casos de uso.

- **`use-cases/`**: Casos de uso que definen el flujo principal de cada acción.
- **`services/`**: Servicios que encapsulan lógica reutilizable entre casos de uso.

---

## 🧰 `common/`

Herramientas y configuraciones reutilizables en toda la app.

- **`config/`**: Configuraciones de entorno, JWT, Bcrypt, etc.
- **`data/`**: Configuraciones para la conexión a la base de datos.
- **`errors/`**: Definiciones de errores personalizados y manejadores globales.
- **`types/`**: Tipos globales y namespaces reutilizables.

---

## 🧠 `domain/`

Contiene el **corazón del negocio**. Totalmente agnóstico a cualquier framework o librería.

- **`entities/`**: Entidades del dominio (p. ej. `User`, `Product`).
- **`enums/`**: Enumeraciones relevantes al dominio.
- **`interfaces/`**: Interfaces puras.
- **`ports/primary`**: Interfaces que exponen funcionalidades a los `drivers`.
- **`ports/secondary`**: Interfaces que definen las dependencias hacia `drivens`.

---

## 🏗️ `infrastructure/`

Adaptadores concretos que conectan el dominio con el mundo exterior.

### 🔌 `adapters/drivens/`

- **`database/`**:
  - **`mongo/`**: Adaptadores concretos para MongoDB.
    - **`mappers/`**: Transforma los modelos externos en entidades del dominio.
    - **`models/`**: Modelos ODM (p.ej. Mongoose).
    - **`datasources`**: Acceso directo a MongoDB.
    - **`repositories`**: Implementación de los `secondary ports` (repositorios).
  - **`in-memory/`**: Repositorios simulados en memoria (testing/mock).

### 🌐 `drivers/http/`

- **`controllers/`**: Reciben las peticiones HTTP y delegan al `application`.
- **`middlewares/`**: Autenticación, logging, manejo de errores, etc.
- **`routes/`**: Rutas agrupadas por módulo (UserRoutes, AuthRoutes, etc.).
- **`validators/`**: Validadores de entrada (p. ej. Zod).
- **`app.server.ts`**: Configura el servidor Express.
- **`routes.factory.ts`**: Registra y organiza las rutas principales.

---

## 🧺 Testing

```bash
# Ejecutar pruebas unitarias
npm test

# Ejecutar pruebas con cobertura
npm run test:cov
```

Organiza tus pruebas siguiendo la misma estructura del `src/`, usando `__tests__/` o `*.spec.ts`.

---

## ⚙️ Entorno de Desarrollo

```bash
# Instalar dependencias
npm install

# Levantar el contenedor de Docker
docker-compose up -d

# Levantar el servidor en desarrollo
npm run start:dev

# Ejecutar build para producción
npm run build

# Correr en modo producción
npm start
```

---

## 🧱 Principios SOLID

### ✅ S - Responsabilidad Única

Cada clase debe tener una única razón para cambiar. Ej: Los mappers solo mapean, los repositorios solo acceden a datos.

### ✅ O - Abierto/Cerrado

Las entidades y servicios están abiertas a extensión pero cerradas a modificación, gracias a interfaces.

### ✅ L - Sustitución de Liskov

Puedes sustituir una clase hija sin alterar el funcionamiento del código padre.

### ✅ I - Segregación de Interfaces

No forzamos a ninguna clase a implementar métodos que no usa.

### ✅ D - Inversión de Dependencias

El dominio depende de abstracciones, no de implementaciones concretas.

---

## 🧩 Arquitectura Hexagonal (Ports & Adapters)

La arquitectura se basa en **mantener el dominio aislado** de la infraestructura externa:

- **El dominio** no conoce a Express, MongoDB, Zod ni ningún framework.
- **Los drivers** (entrada) conectan el mundo exterior (HTTP, CLI) con el dominio.
- **Los drivens** (salida) permiten que el dominio se conecte con el exterior (DBs, APIs).

Esto permite:

- Testear el dominio de forma independiente.
- Cambiar de base de datos o protocolo sin romper el core.
- Escalar con nuevas entradas (REST, GraphQL, CLI) o salidas (otra DB, cola de eventos).

---

## 📝 Buenas prácticas adicionales

- Usa `Zod` o `Joi` para validar entrada (en `validators/`).
- Escribe tus `DTOs` o interfaces claras para cada capa.
- Usa `middleware` para manejar errores y validaciones de forma centralizada.
- Añade `tests` a tus `use-cases` y `services`.

---

## 📌 Conclusión

Esta estructura te brinda una base sólida, escalable y mantenible. Estás aplicando correctamente principios de diseño modernos y separación de responsabilidades.

Si deseas agregar WebSockets, colas, microservicios o GraphQL, podrás hacerlo manteniendo intacto tu dominio.

---

<p align="center">
    Autor: Ing. Luis Reyes.
    <p align="center">
      <a href="https://github.com/ing-reyes" target="blank">
      <img src="https://avatars.githubusercontent.com/u/171001900?v=4" width="200" style="border-radius:100%;" alt="Ing. Luis Reyes"/>
      </a>
    </p>
</p>
