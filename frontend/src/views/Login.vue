<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-250">
    <!-- <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm"> -->

    <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-md w-80">
      
      <h1 class="text-2xl font-bold text-center text-indigo-600 mb-6"> <img src="/FlashForgeImageCropped.png" alt="FlashForge logo" class="h-8 w-8" /> FlashForge</h1>
      <h2 class="text-xl font-semibold mb-4 text-center">
        {{ isRegister ? 'Register' : 'Login' }}
      </h2>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full mb-3 p-2 border border-gray-400 rounded"
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full mb-4 p-2 border border-gray-400 rounded"
      />

      <button
        type="submit"
        class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        {{ isRegister ? 'Register' : 'Login' }}
      </button>

      <p v-if="error" class="text-red-600 text-sm mt-2 text-center">{{ error }}</p>

      <p class="text-center text-sm mt-4 text-gray-600">
        {{ isRegister ? 'Already have an account?' : 'Don\'t have an account?' }}
        <button @click.prevent="isRegister = !isRegister" class="text-blue-500 underline ml-1">
          {{ isRegister ? 'Login' : 'Register' }}
        </button>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../axios'

const username = ref('')
const password = ref('')
const error = ref('')
const isRegister = ref(false)
const router = useRouter()

const handleSubmit = async () => {
  error.value = ''
  const endpoint = isRegister.value ? '/users/register' : '/users/login'

  try {
    const res = await axios.post(endpoint, {
      username: username.value,
      password: password.value
    })

    if (isRegister.value) {
      alert('Registered successfully! You can now log in.')
      isRegister.value = false
      password.value = ''
    } else {
      localStorage.setItem('token', res.data.token)
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Something went wrong'
  }
}
</script>
