<template>
    <div>
        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div
                    style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20"
                        style="border-radius: 53px">

                        <h1 class="text-xl mb-6">
                            Welcome to <b> {{ name }}</b>
                        </h1>

                        <div class="flex flex-col">
                            <div class="w-full">
                                <label for="firstname"
                                    class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">ชื่อ</label>
                                <InputText id="firstname" type="text" placeholder="First Name"
                                    class="w-full mb-4" v-model="form.firstname" />
                            </div>

                            <div class="w-full">
                                <label for="lastname"
                                    class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">นามสกุล</label>
                                <InputText id="lastname" type="text" placeholder="Last Name"
                                    class="w-full mb-4" v-model="form.lastname" />
                            </div>

                            <Button label="เช็ค" severity="primary" class="mb-6" v-on:click="check" />
                        </div>

                        <DataTable :value="users">
                            <Column field="id" header="ID"></Column>
                            <Column field="firstname" header="First Name"></Column>
                            <Column field="lastname" header="Last Name"></Column>
                            <Column field="email" header="Email"></Column>
                        </DataTable>

                        <Button label="ออกจากระบบ" severity="danger" class="w-full mt-6" v-on:click="logout" />
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
let users = ref()
let form = ref({
    firstname: '',
    lastname: ''
})

const config = useRuntimeConfig()
const userStore = useUserStore()

const user_id = useCookie('user_id').value;

axios.get(`${config.public.API_URL}/profile/${user_id}`, {
    headers: {
        Authorization: "Bearer " + useCookie('access_token').value
    }
})
    .then(function (response) {
        name.value = response.data.firstname + ' ' + response.data.lastname;
    });

const check = () => {
    axios.post(`${config.public.API_URL}/check`, form.value, {
        headers: {
            Authorization: "Bearer " + useCookie('access_token').value
        }
    })
        .then(function (response) {
            users.value = response.data;
        });
}

const logout = () => {
    userStore.logout()
    navigateTo('/login')
}
</script>

<style scoped></style>