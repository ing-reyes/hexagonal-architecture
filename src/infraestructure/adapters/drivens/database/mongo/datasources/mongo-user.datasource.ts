import { ApiAllResponse, ApiOneResponse, PaginationDTO } from "../../../../../../domain/interfaces";
import { BcryptAdapter } from '../../../../../../common/config';
import { CreateUserDTO, UpdateUserDTO, UserResponseDTO } from "../../../../../../domain/entities";
import { HttpStatus } from "../../../../../../domain/enums";
import { ManagerError } from "../../../../../../common/errors";
import { UserDatasourcePort } from "../../../../../../domain/ports/secondary";
import { UserMapper } from "../mappers";
import { UserModel } from "../models";

export class MongoUserDatasource implements UserDatasourcePort {

    constructor(
        private readonly bcryptAdapter: BcryptAdapter
    ){}

    async create(createUserDto: CreateUserDTO): Promise<ApiOneResponse<UserResponseDTO>> {
        try {
            const user = await UserModel.create({
                ...createUserDto,
                password: await this.bcryptAdapter.hash(createUserDto.password),
            });
            if (!user) {
                throw ManagerError.conflict('User not created');
            }

            await user.save();  

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: UserMapper.modelUserToEntity(user),
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    async findAll(paginationDTO: PaginationDTO): Promise<ApiAllResponse<UserResponseDTO>> {
        const { limit, page } = paginationDTO;
        const skip = (page - 1) * limit;

        try {
            const [total, users] = await Promise.all([
                UserModel.countDocuments({ isActive: true }),
                UserModel.find({ isActive: true }).skip(skip).limit(limit),
            ]);

            const lastPage = Math.ceil(total / limit);

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                meta: {
                    page,
                    lastPage,
                    limit,
                    total,
                },
                data: users.map(UserMapper.modelUserToEntity),
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    async findOneById(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        try {
            const user = await UserModel.findOne({_id:id});
            const userMapper = user ? UserMapper.modelUserToEntity(user) : null;

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: userMapper,
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    async update(id: string, updateUserDTO: UpdateUserDTO): Promise<ApiOneResponse<UserResponseDTO | null>> {
        try {
            const user = await UserModel.findOneAndUpdate({_id: id, isActive: true}, updateUserDTO, {new: true});
            const userMapper = user ? UserMapper.modelUserToEntity(user) : null;

            await user?.save();

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: userMapper,
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
    async remove(id: string): Promise<ApiOneResponse<UserResponseDTO | null>> {
        try {
            const user = await UserModel.findOneAndDelete({_id: id, isActive: true});
            const userMapper = user ? UserMapper.modelUserToEntity(user) : null;

            await user?.save();

            return {
                status: {
                    statusCode: HttpStatus.OK,
                    statusMsg: 'OK',
                    error: null,
                },
                data: userMapper,
            }
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}