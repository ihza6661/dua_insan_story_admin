import api from "@/lib/api";
import { UpdateUserSchema, UserSchema } from "@/lib/schemas";
import { User } from "@/lib/types";

interface UsersResponse {
    data: User[];
}

interface UserResponse {
    data: User;
}

export async function getAdminUsers(): Promise<User[]> {
    const response = await api.get<UsersResponse>('/admin/users');
    return response.data.data;
}

export async function getCustomerUsers(): Promise<User[]> {
    const response = await api.get<UsersResponse>('/admin/users?role=customer');
    return response.data.data;
}

export async function getAdminUserById(id: number): Promise<User> {
    const response = await api.get<UserResponse>(`/admin/users/${id}`);
    return response.data.data;
}

export async function createAdminUser(data: UserSchema): Promise<any> {
    return createUser(data, 'admin');
}

export async function createCustomerUser(data: UserSchema): Promise<any> {
    return createUser(data, 'customer');
}

async function createUser(data: UserSchema, role: string): Promise<any> {
    const response = await api.post('/admin/users', { ...data, role });
    return response.data;
}

export async function updateAdminUser({ id, data }: { id: number, data: UpdateUserSchema }): Promise<any> {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
}

export async function deleteAdminUser(id: number): Promise<any> {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
}