<template>
    <div>
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                        style="border-radius: 53px">

                        <h1 class="text-center text-2xl mb-8 font-bold">A03-Injection</h1>

                        <form @submit.prevent="login">
                            <label for="email1"
                                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">อีเมล</label>
                            <InputText id="email1" type="text" placeholder="Email address"
                                class="w-full mb-8" v-model="form.email" />

                            <label for="password1"
                                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">รหัสผ่าน</label>
                            <Password id="password1" v-model="form.password" placeholder="Password" :toggleMask="true"
                                class="mb-4" fluid :feedback="false"></Password>

                            <Button severity="primay" label="เข้าสู่ระบบ" class="w-full" type="submit"></Button>
                            <Button severity="secondary" label="สมัครสมาชิก" class="w-full mt-2" as="router-link"
                                to="/register"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';
import Swal from 'sweetalert2'

const config = useRuntimeConfig()
const userStore = useUserStore()

const form = ref({
    email: '',
    password: '',
});

const login = () => {
    axios.post(`${config.public.API_URL}/auth/login`, form.value)
        .then(function (response) {
            userStore.authenticate(response.data.access_token)
            navigateTo('/')
        })
        .catch(function (error) {
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: error.response.data.message,
                icon: 'error'
            })
        });
}
</script>

<style scoped></style>