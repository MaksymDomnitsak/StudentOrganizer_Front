export interface SaveUserWithoutGroup{
    userId: number;
    email: string;
    userName: string;
    isEventer: boolean;
    jwtToken: string;
    accessToken: string;
    groupId?: number;
    role: string;
}