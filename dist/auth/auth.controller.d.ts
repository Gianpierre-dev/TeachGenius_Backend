import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        teacher: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        teacher: {
            id: string;
            email: string;
            name: string;
        };
    }>;
}
