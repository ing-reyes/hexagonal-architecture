import { AppServer, RoutesFactory } from "./infraestructure/adapters/drivers/http";
import { AuthController, UserController } from "./infraestructure/adapters/drivers/http/controllers";
import { AuthMiddleware, UserMiddleware } from "./infraestructure/adapters/drivers/http/middlewares";
import { AuthRoutes, UserRoutes } from "./infraestructure/adapters/drivers/http/routes";
import { AuthService, UserService } from "./application/services";
import { BcryptAdapter, envs, JwtConfig } from "./common/config";
import { CreateUserUseCase, FindAllUsersUseCase, FindOneUserByIdUseCase, RemoveUserUseCase, UpdateUserUseCase } from "./application/use-cases/user";
import { Handler } from "./common/errors";
import { MongoAuthDatasourceAdapter, MongoAuthRepositoryAdapter, MongoUserDatasourceAdapter, MongoUserRepositoryAdapter } from "./infraestructure/adapters/drivens/database/mongo";
import { MongoDB } from "./common/data";
import { PaginationMiddleware, ValidateIdMiddleware } from "./common/middlewares";
import { RefreshTokenUseCase, SignInUseCase, SignUpUseCase } from "./application/use-cases/auth";

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