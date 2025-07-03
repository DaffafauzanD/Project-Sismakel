import type { User } from "@/stores/auth";

export function hasRole(user: User | null, role: string | string[]) : boolean {
    if (!user || !user.role) return false;
    
    console.log("user.role ::", user.role);

    if (Array.isArray(role)){
        return role.includes(user.role);
    }
    console.log("role ::", role);
    return user.role === role;
}

export function hasPermission(user: User | null, permission: string | string[]) : boolean{
    if (!user || !user.permission) return false;
    if (Array.isArray(permission)){
        return permission.some((perm) => user.permission!.includes(perm));
    }
    return user.permission.includes(permission);
}