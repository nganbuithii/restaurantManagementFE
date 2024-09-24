// permissionUtils.js
export const checkPermission = (permissions, module, method) => {
    return permissions.some(permission =>
        permission.module === module &&
        permission.method === method 
        // &&
        // permission.apiPath === apiPath
    );
};