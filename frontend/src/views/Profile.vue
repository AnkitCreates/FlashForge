<template>
  <div class="p-4">
    <h2 class="text-xl">Profile</h2>
    <p><strong>Username:</strong> {{ user?.username }}</p>
  </div>
</template>

<script setup>
import axios from '../axios';
import { onMounted, ref } from 'vue';

const user = ref(null);

onMounted(async () => {
  const res = await axios.get('/auth/profile');
  user.value = res.data.user;
});
</script>