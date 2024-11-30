export interface SaveUser{
    userId: number;
    email: string;
    userName: string;
    isEventer: boolean;
    jwtToken: string;
    accessToken: string;
    groupId: string;
    role: string;
}