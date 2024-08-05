import { defineStore } from 'pinia'
import { jwtDecode } from "jwt-decode"

export const useUserStore = defineStore('user', {
    state: () => ({
        authenticated: (useCookie('access_token').value != null) ? true : false,
    }),
    actions: {
        authenticate(token: string) {
            useCookie('access_token').value = token;
            useCookie('user_id').value = jwtDecode(token).id;
            this.authenticated = true;
        },
        logout() {
            this.authenticated = false;
            useCookie('access_token').value = null;
            useCookie('user_id').value = null;
        }
    }
})