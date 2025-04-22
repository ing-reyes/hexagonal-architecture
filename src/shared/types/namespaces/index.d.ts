import { UserResponseDTO } from "../../interfaces";

declare global {
    namespace Express{
        interface Request{
            user: UserResponseDTO
        }
    }
}