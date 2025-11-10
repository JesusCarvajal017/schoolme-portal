export interface RolFormPermission {
    id: number;
    rolId: number;
    FormId: number;
    PermissionId: number;
    rolName: string;
    formName: string;
    permissionName?: string;  
    status: number;
}
export interface CreateModelRolFormPermission {
    id: number;
    rolId: number;
    rolName: string;
    formName: string;
    permissionName: string;
    formId: number;
    permissionId: number;
    status: number;
}