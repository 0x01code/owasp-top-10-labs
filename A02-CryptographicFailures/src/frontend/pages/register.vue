<template>
    <div>
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                        style="border-radius: 53px">

                        <form @submit.prevent="register">
                            <label for="name"
                                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">ชื่อ</label>
                            <InputText id="name" type="text" placeholder="Full name" class="w-full mb-4"
                                v-model="form.name" />

                            <label for="email1"
                                class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">อีเมล</label>
                            <InputText id="email1" type="text" placeholder="Email address"
                                class="w-full mb-4" v-model="form.email" />

                            <label for="password1"
                                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">รหัสผ่าน</label>
                            <Password id="password1" v-model="form.password" placeholder="Password" :toggleMask="true"
                                class="mb-4" fluid :feedback="false"></Password>

                            <label for="password2"
                                class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">ยืนยันรหัสผ่าน</label>
                            <Password id="password2" v-model="form.password_confirm" placeholder="Password"
                                :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                            <Button severity="primay" label="สมัครสมาชิก" class="w-full" type="submit"></Button>
                            <Button severity="secondary" label="เข้าสู่ระบบ" class="w-full mt-2" as="router-link"
                                to="/login"></Button>
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
    name: '',
    email: '',
    password: '',
    password_confirm: '',
});

const register = () => {
    axios.post(`${config.public.API_URL}/auth/register`, form.value)
        .then(function (response) {
            Swal.fire({
                title: 'ทำรายการสำเร็จ',
                text: response.data.message,
                icon: 'success'
            })
            navigateTo('/login')
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