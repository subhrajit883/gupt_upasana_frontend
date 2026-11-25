export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const authUrl = {
    login: `${BASE_URL}/api/auth/login`,
    register: `${BASE_URL}/api/auth/register`,
    adminLogin: `${BASE_URL}/api/admin/login`,
    logout: `${BASE_URL}/api/auth/logout`,
    me: `${BASE_URL}/api/auth/me`,
    changePassword: `${BASE_URL}/api/auth/changePassword`,
    forgotPassword: `${BASE_URL}/api/auth/forgot-password`,
    resetPassword: `${BASE_URL}/api/auth/reset-password`,
    adminChangePassword: `${BASE_URL}/api/auth/change-password`,
    allUser: `${BASE_URL}/api/users`
};

export const bookVisitUrl = {
    create: `${BASE_URL}/api/bookVisits`,
    getbyUser: `${BASE_URL}/api/bookVisits/my`
};
export const pujaUpdatesUrl = {
    get: `${BASE_URL}/api/puja-updates`,
    adminGetAll: `${BASE_URL}/api/puja-updates/admin/all`,
    create: `${BASE_URL}/api/puja-updates`,
    update: (id) => `${BASE_URL}/api/puja-updates/${id}`,
    delete: (id) => `${BASE_URL}/api/puja-updates/${id}`,
    publish: (id) => `${BASE_URL}/api/puja-updates/${id}/publish`,
    sendPush: (id) => `${BASE_URL}/api/puja-updates/${id}/send-push`,
    vapidKey: `${BASE_URL}/api/puja-updates/vapid-key`,
    subscribe: `${BASE_URL}/api/puja-updates/subscribe`,
    unsubscribe: `${BASE_URL}/api/puja-updates/unsubscribe`,
    testPush: `${BASE_URL}/api/puja-updates/test-push`,
};

export const donationUrl = {
    packages: `${BASE_URL}/api/packages`,
    createOrder: `${BASE_URL}/api/donations/create-order`,
    verifyPayment: `${BASE_URL}/api/donations/verify-payment`,
    my: `${BASE_URL}/api/donations/my`,
    getById: (id) => `${BASE_URL}/api/donations/${id}`,
    adminGetAll: `${BASE_URL}/api/donations/admin/all`,
};