<template>
    <div>
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                        style="border-radius: 53px">

                        <h1 class="text-xl">
                            Welcome to <b> {{ name }}</b>
                        </h1>

                        <InputText type="text" class="w-full mt-4" v-model="image_url" />
                        <Button label="Check" severity="primary" class="w-full mt-2" v-on:click="check" />

                        <img :src="response_data" class="mt-2">

                        <Button label="ออกจากระบบ" severity="danger" class="mt-6" v-on:click="logout" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';

definePageMeta({
    middleware: 'auth'
})

let name = ref('')
let image_url = ref('')
let response_data = ref('')

const config = useRuntimeConfig()
const userStore = useUserStore()

const user_id = useCookie('user_id').value;

axios.get(`${config.public.API_URL}/profile/${user_id}`, {
    headers: {
        Authorization: "Bearer " + useCookie('access_token').value
    }
})
    .then(function (response) {
        name.value = response.data.name;
    });

const check = () => {
    axios.post(`${config.public.API_URL}/image`, {
        image_url: image_url.value
    }, {
        headers: {
            Authorization: "Bearer " + useCookie('access_token').value
        }
    })
        .then(function (response) {
            response_data.value = response.data.image;
        });
}

const logout = () => {
    userStore.logout()
    navigateTo('/login')
}
</script>

<style scoped></style>