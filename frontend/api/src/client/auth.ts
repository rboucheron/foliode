import type { UserSignInDTO } from "contract/UserSignInDTO";
import type { UserSignUpDTO } from "contract/UserSignUpDTO";
import { createClient } from "utils/creatClient";

const apiClient = createClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export const apiSignUpUser = async (user: UserSignUpDTO) => {
    try {
        const response = await apiClient.post('/api/user/signup', user);
        return response.data;
    } catch (error) {
        console.error("Error signing up user:", error);
        throw error;
    }
}

export const apiSignInUser = async (user: UserSignInDTO) => {
    try {
        const response = await apiClient.post('/api/user/signin', user);
        return response.data;
    } catch (error) {
        console.error("Error signing in user:", error);
        throw error;
    }
}

