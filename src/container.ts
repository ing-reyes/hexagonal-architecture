import { AppServer } from "./app.server";
import { AuthController, AuthRoutes } from "./modules/auth/infraestructure/adapters/drivers/http";
import { AuthMiddleware } from "./modules/auth/infraestructure/adapters/drivers/http/middlewares";
import { AuthService } from "./modules/auth/application/services";
import { BcryptAdapter, envs, JwtConfig } from "./shared/config";
import { CreateUserUseCase, FindAllUsersUseCase, FindOneUserByIdUseCase, RemoveUserUseCase, UpdateUserUseCase } from "./modules/user/application/use-cases";
import { Handler } from "./shared/errors";
import { MongoAuthDatasourceAdapter, MongoAuthRepositoryAdapter } from "./modules/auth/infraestructure/adapters/drivens/database/mongo";
import { MongoDB } from "./shared/data";
import { MongoUserDatasourceAdapter, MongoUserRepositoryAdapter } from "./modules/user/infraestructure/adapters/drivens/database/mongo";
import { PaginationMiddleware, ValidateIdMiddleware } from "./shared/middlewares";
import { RefreshTokenUseCase, SignInUseCase, SignUpUseCase } from "./modules/auth/application/use-cases";
import { RoutesFactory } from "./routes.factory";
import { UserController, UserRoutes } from "./modules/user/infraestructure/adapters/drivers/http";
import { UserMiddleware } from "./modules/user/infraestructure/adapters/drivers/http/middlewares";
import { UserService } from "./modules/user/application/services";

export const bcryptAdapter = new BcryptAdapter();
export const jwtConfig = new JwtConfig();
//* -----------------User---------------------------------------------
export const userDatasource = new MongoUserDatasourceAdapter(bcryptAdapter)
export const mongoUserRepositoryAdapter = new MongoUserRepositoryAdapter(userDatasource)

export const createUserUseCase = new CreateUserUseCase(mongoUserRepositoryAdapter)
export const findAllUsersUseCase = new FindAllUsersUseCase(mongoUserRepositoryAdapter)
export const findOneUserByIdUseCase = new FindOneUserByIdUseCase(mongoUserRepositoryAdapter)
export const updateUserUseCase = new UpdateUserUseCase(mongoUserRepositoryAdapter)
export const removeUserUseCase = new RemoveUserUseCase(mongoUserRepositoryAdapter)

export const userService = new UserService(
    createUserUseCase,
    findAllUsersUseCase,
    findOneUserByIdUseCase,
    updateUserUseCase,
    removeUserUseCase,
)
export const handler = new Handler()
export const userController = new UserController(userService, handler)
export const userMiddleware = new UserMiddleware()
export const paginationMiddleware = new PaginationMiddleware()
export const validateIdMiddleware = new ValidateIdMiddleware()
export const userRoutes = new UserRoutes(userController, userMiddleware, paginationMiddleware, validateIdMiddleware)

//* -----------------End User---------------------------------------------

//* -----------------Auth---------------------------------------------

export const mongoAuthDatasourceAdapter = new MongoAuthDatasourceAdapter(jwtConfig, bcryptAdapter);
export const mongoAuthRepositoryAdapter = new MongoAuthRepositoryAdapter(mongoAuthDatasourceAdapter);

export const signInUseCase = new SignInUseCase(mongoAuthRepositoryAdapter);
export const signUpUseCase = new SignUpUseCase(mongoAuthRepositoryAdapter);
export const refreshTokenUseCase = new RefreshTokenUseCase(mongoAuthRepositoryAdapter);

export const authService = new AuthService(signInUseCase, signUpUseCase, refreshTokenUseCase);
export const authController = new AuthController(authService, handler);

export const authMiddleware = new AuthMiddleware(jwtConfig, userDatasource);
export const authRoutes = new AuthRoutes(authController, authMiddleware);


//* -----------------End Auth---------------------------------------------

export const routesFactory = new RoutesFactory(userRoutes, authRoutes);
export const mongoDB = new MongoDB();
export const appServer = new AppServer({port: envs.PORT}, routesFactory);