<template>
  <div class="p-4 max-w-md mx-auto">
    <h2 class="text-xl mb-4">Register</h2>
    <form @submit.prevent="register">
      <input v-model="username" class="input" placeholder="Username" />
      <input type="password" v-model="password" class="input" placeholder="Password" />
      <button class="btn">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '../axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const register = async () => {
  try {
    const res = await axios.post('/auth/register', { 
      username: username.value, 
      password: password.value 
    });

    localStorage.setItem('token', res.data.token); // ✅ Automatically log in
    router.push('/dashboard'); // 🚀 Send to dashboard
  } catch (err) {
    console.error("Registration failed", err.response?.data || err.message);
    // optionally show a message on screen
  }
};
</script>