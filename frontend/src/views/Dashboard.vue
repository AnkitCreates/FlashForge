<template>
  <div class="p-4 max-w-7xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-4xl font-bold text-center w-full">Decks</h2>
      <img src="/FlashForgeImageCropped.png" alt="FlashForge logo" class="h-12 w-10 object-contain ml-auto" />
    </div>
  </div>

  <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
    <input v-model="newTitle" class="flex-1 input border px-3 py-2 rounded shadow-sm"
      placeholder="Enter new deck title" />
    <button @click="createDeck" class="btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
      ➕ Add Deck
    </button>
  </div>

  <div class="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <!-- <div v-for="deck in decks" :key="deck.id"
        class="bg-white border shadow-md rounded-lg p-4 hover:shadow-lg transition"> -->

    <div v-for="(deck, index) in decks" :key="deck.id" :class="[
      'p-5 rounded-lg shadow-md transition hover:shadow-xl',
      deckColors[index % deckColors.length],
    ]">
      <h3 class="text-xl font-semibold mb-2">{{ deck.title }}</h3>
      <p class="text-sm text-gray-500">
        Last Reviewed: {{ formatDate(deck.lastReviewed) }}
      </p>
      <p class="text-sm text-gray-600 mb-4">
        Score: {{ formatScore(deck.score) }}
      </p>

      <!-- buttons -->
      <div class="flex flex-wrap gap-2">
        <button @click="goToDeck(deck.id)" class="btn-sm bg-gray-300 hover:bg-gray-400">
          View
        </button>
        <!-- <button @click="reviewDeck(deck.id)" class="btn-sm bg-blue-600 text-white hover:bg-blue-700">
          Review
        </button> -->

        <button @click="reviewDeck(deck.id)" class="btn-sm bg-gray-300 text-black hover:bg-blue-700">
          Review
        </button>
        
        <button @click="smartReview(deck.id)" class="btn-sm bg-gray-300 text-black hover:bg-purple-700">
          SmartR✨
        </button>

        <button @click="exportDeck(deck.id, deck.title)" class="btn-sm bg-gray-300 hover:bg-blue-700">
          Export
        </button>
        <!-- <button @click="deleteDeck(deck.id)" class="btn-sm bg-red-500 text-white hover:bg-red-600">Del🗑️</button> -->

        <!-- Delete Button -->
        <button @click="deleteDeck(deck.id)"
          class="btn-sm bg-gray-300 text-white hover:bg-red-600 flex items-center justify-center p-2 rounded"
          title="Delete Deck">
          <!-- Your SVG here -->

          <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5"> <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" /> </svg> -->

          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script setup>
import axios from "../axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const deckColors = [
  "bg-red-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-indigo-100",
  "bg-teal-100",
];

const decks = ref([]);
const newTitle = ref("");
const router = useRouter();

const fetchDecks = async () => {
  const res = await axios.get("/decks");
  decks.value = res.data;
};

const formatDate = (date) => {
  if (!date) return "Never";
  return new Date(date).toLocaleString();
};

const formatScore = (score) => {
  if (score == null) return "N/A";
  return `${Math.round(score * 100)}%`;
};

const createDeck = async () => {
  await axios.post("/decks", { title: newTitle.value });
  newTitle.value = "";
  fetchDecks();
};

const smartReview = (id) => {
  router.push({
    name: "Review",
    params: { deckId: id },
    query: { mode: "smart" },
  });
};

const reviewDeck = (id) => {
  router.push(`/review/${id}`);
};

const exportDeck = async (deckId, title) => {
  try {
    const res = await axios.get(`/decks/${deckId}/export`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Export failed", err);
    alert("Failed to export deck.");
  }
};

const deleteDeck = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this deck?"
  );
  if (!confirmed) return;

  try {
    await axios.delete(`/decks/${id}`);
    fetchDecks();
  } catch (err) {
    console.error("Failed to delete deck", err);
    alert("Failed to delete the deck.");
  }
};

const goToDeck = (id) => router.push(`/deck/${id}`);

onMounted(fetchDecks);
</script>

<style scoped>
.btn-sm {
  @apply text-sm px-3 py-1.5 rounded font-medium transition;
}
</style>
