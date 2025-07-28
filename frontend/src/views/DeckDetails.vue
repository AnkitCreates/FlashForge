<template>
  <div class="p-4">
    <h2 class="text-2xl mb-4">Cards</h2>
    <input v-model="front" class="input" placeholder="Front" />
    <input v-model="back" class="input" placeholder="Back" />
    <button @click="addCard" class="btn">Add Card</button>
    <!-- <button @click="startReview" class="btn mt-4">Review Deck</button> -->

    <div class="mt-4">
      <div v-for="card in cards" :key="card.id" class="border p-2 my-2">
        <p><strong>Q:</strong> {{ card.front }}</p>
        <p><strong>A:</strong> {{ card.back }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from '../axios';

const cards = ref([]);
const front = ref('');
const back = ref('');
const route = useRoute();
const deckId = route.params.deckId;

const fetchCards = async () => {
  const res = await axios.get(`/cards/deck/${deckId}`);
  cards.value = res.data;
};

const addCard = async () => {
  await axios.post('/cards', { front: front.value, back: back.value, deckId });
  front.value = back.value = '';
  fetchCards();
};

onMounted(fetchCards);
</script>