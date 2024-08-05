<template>
    <div>
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                        style="border-radius: 53px">

                        <label for="pin"
                            class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">PIN</label>
                        <InputText id="pin" type="text" minlength="4" maxlength="4" placeholder="****" class="w-full mb-2" v-model="pin" />

                        <Button label="ดำเนินการต่อ" severity="primary" class="w-full" v-on:click="check_pin" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import Swal from 'sweetalert2';

definePageMeta({
    middleware: 'auth'
})

let pin = ref('')

const config = useRuntimeConfig()

const check_pin = () => {
    axios.post(`${config.public.API_URL}/auth/pin`, {
        pin: pin.value
    }, {
        headers: {
            Authorization: "Bearer " + useCookie('access_token').value
        }
    })
        .then(function (response) {
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