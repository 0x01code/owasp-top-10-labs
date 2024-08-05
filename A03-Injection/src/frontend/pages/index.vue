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

                        <div class="mt-6">
                            <InputText id="domain" type="text" placeholder="www.google.com"
                                class="w-full mb-8" v-model="domain" v-on:keyup.enter="check" />
                            <Button label="Check" severity="primary" class="mt-6" v-on:click="check" />
                        </div>

                        <div v-html="result"></div>

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
let domain = ref('')
let result = ref('')

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
    axios.post(`${config.public.API_URL}/alive`, {
        'domain': domain.value
    }, {
        headers: {
            Authorization: "Bearer " + useCookie('access_token').value
        }
    })
        .then(function (response) {
            result.value = response.data.message.replace('\n','<br>');
        })
        .catch(function (error) {
            result.value = error.response.data.message.replace('\n','<br>');
        });
}

const logout = () => {
    userStore.logout()
    navigateTo('/login')
}
</script>

<style scoped></style>