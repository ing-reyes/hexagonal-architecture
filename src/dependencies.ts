import { AppServer, RoutesFactory } from "./infraestructure/adapters/drivers/http";
import { AuthController, UserController } from "./infraestructure/adapters/drivers/http/controllers";
import { AuthMiddleware, UserMiddleware } from "./infraestructure/adapters/drivers/http/middlewares";
import { AuthRoutes, UserRoutes } from "./infraestructure/adapters/drivers/http/routes";
import { AuthService, UserService } from "./application/services";
import { BcryptAdapter, envs, JwtConfig } from "./common/config";
import { CreateUserUseCase, FindAllUsersUseCase, FindOneUserByIdUseCase, RemoveUserUseCase, UpdateUserUseCase } from "./application/use-cases/user";
import { Handler } from "./common/errors";
import { MongoAuthDatasource, MongoAuthRepository, MongoUserDatasource, MongoUserRepository } from "./infraestructure/adapters/drivens/database/mongo";
import { MongoDB } from "./common/data";
import { PaginationMiddleware, ValidateIdMiddleware } from "./common/middlewares";
import { RefreshTokenUseCase, SignInUseCase, SignUpUseCase } from "./application/use-cases/auth";

export const bcryptAdapter = new BcryptAdapter();
export const jwtConfig = new JwtConfig();
//* -----------------User---------------------------------------------
export const userDatasource = new MongoUserDatasource(bcryptAdapter)
export const mongoUserRepository = new MongoUserRepository(userDatasource)

export const createUserUseCase = new CreateUserUseCase(mongoUserRepository)
export const findAllUsersUseCase = new FindAllUsersUseCase(mongoUserRepository)
export const findOneUserByIdUseCase = new FindOneUserByIdUseCase(mongoUserRepository)
export const updateUserUseCase = new UpdateUserUseCase(mongoUserRepository)
export const removeUserUseCase = new RemoveUserUseCase(mongoUserRepository)

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

export const mongoAuthDatasource = new MongoAuthDatasource(jwtConfig, bcryptAdapter);
export const mongoAuthRepository = new MongoAuthRepository(mongoAuthDatasource);

export const signInUseCase = new SignInUseCase(mongoAuthRepository);
export const signUpUseCase = new SignUpUseCase(mongoAuthRepository);
export const refreshTokenUseCase = new RefreshTokenUseCase(mongoAuthRepository);

export const authService = new AuthService(signInUseCase, signUpUseCase, refreshTokenUseCase);
export const authController = new AuthController(authService, handler);

export const authMiddleware = new AuthMiddleware(jwtConfig, userDatasource);
export const authRoutes = new AuthRoutes(authController, authMiddleware);


//* -----------------End Auth---------------------------------------------

export const routesFactory = new RoutesFactory(userRoutes, authRoutes);
export const mongoDB = new MongoDB();
export const appServer = new AppServer({port: envs.PORT}, routesFactory);