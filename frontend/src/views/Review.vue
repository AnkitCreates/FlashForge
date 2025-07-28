<template>
  <div v-if="currentCard" class="flex flex-col items-center mt-[100px]">
    <!-- Flashcard with flip effect -->
    <div class="card-wrapper" :class="{ flipped: showBack }">
      <div class="card">
        <div class="front face">
          {{ currentCard.front }}
        </div>
        <div class="back face">
          {{ currentCard.back }}
        </div>
      </div>
    </div>

    <div v-if="!showBack" class="w-[350px] h-2 bg-gray-200 mt-2 rounded overflow-hidden">
      <div class="bg-blue-500 h-full transition-[width] duration-1000 ease-linear"
        :style="{ width: `${countdown * 10}%` }"></div>
    </div>

    <!-- <p class="mt-2 text-gray-500 text-sm font-mono tracking-wide">
      {{ showBack ? "Let's rate this card!" : `Revealing in ${countdown} seconds...` }}
    </p> -->

    <!-- <p class="mt-2 text-gray-500 text-sm font-mono tracking-wide">
      {{ showBack ? "" : `Revealing in ${countdown} seconds...` }}
    </p> -->

    <div class="flex mt-6 space-x-3 justify-center">
      <!-- <button @click="rateCard(0)"
        class="
          bg-red-500
          btn
        "
      >Hard</button>
    <button @click="rateCard(0.5)"
      class="
        bg-yellow-500
        btn
      "
    >Medium</button>
    <button @click="rateCard(1)"
      class="
        bg-green-600
        btn
      "
    >Easy</button> -->

      <button @click="rateCard(0)" class="px-4 py-2 text-white bg-blue-300 rounded hover:bg-red-500">
        Hard
      </button>
      <button @click="rateCard(0.5)" class="px-4 py-2 text-white bg-blue-300 rounded hover:bg-yellow-400">
        Medium
      </button>
      <button @click="rateCard(1)" class="px-4 py-2 text-white bg-blue-300 rounded hover:bg-green-700">
        Easy
      </button>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center min-h-screen text-center">
    <p class="text-xl">Review Complete</p>
    <button @click="submitReview" class="mt-4 bg-blue-600 btn">
      Submit Review
    </button>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "../axios";

const route = useRoute();
const router = useRouter();

const deckId = route.params.deckId;
const mode = route.query.mode || "normal";
const cards = ref([]);
const currentIndex = ref(0);
const showBack = ref(false);
const results = ref([]);
let flipTimer = null;

const currentCard = computed(() => cards.value[currentIndex.value]);

const loadCards = async () => {
  try {
    const res = await axios.post("/reviews/start", { deckId, mode });
    cards.value = res.data;
    currentIndex.value = 0;
    showBack.value = false;
    startFlipTimer();
  } catch (err) {
    console.error("Failed to load cards:", err.response?.data || err.message);
  }
};

const startFlipTimer = () => {
  clearTimeout(flipTimer);
  countdown.value = 10;
  progress.value = 100;

  const interval = setInterval(() => {
    countdown.value--;
    progress.value = countdown.value * 10;

    if (countdown.value <= 0) {
      clearInterval(interval);
      showBack.value = true;
    }
  }, 1000);

  flipTimer = interval;
};

const rateCard = (difficulty) => {
  if (!currentCard.value) return;
  results.value.push({ cardId: String(currentCard.value.id), difficulty });
  currentIndex.value++;
  showBack.value = false;
  currentCard.value ? startFlipTimer() : clearTimeout(flipTimer);
};

const submitReview = async () => {
  try {
    await axios.post("/reviews/submit", {
      deckId,
      results: results.value,
    });

    // force fetch 
    await axios.get("/decks");

    router.push("/dashboard");
  } catch (err) {
    console.error("Submit failed", err.response?.data || err.message);
  }
};

const countdown = ref(10);
const progress = ref(100); // percent

onMounted(loadCards);
</script>

<style scoped>

.card-container {
  position: relative;
  width: 350px;
  height: 350px;
  perspective: 1000px;
}

.card-wrapper {
  width: 350px;
  height: 350px;
  margin-bottom: 0.1rem;
  overflow: hidden;
}

.card {
  position: relative;
  width: 350px;
  height: 350px;
  transform-style: preserve-3d;
  transition: transform 0.3s;
}

.card-wrapper.flipped .card {
  transform: rotateY(180deg);
}

.face, .front, .back {
  position: absolute;
  width: 350px;
  height: 350px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  background: #fff;
  border: 1.1px solid #ddd;  /* Specify the border for the card */
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  border-radius: 0.5rem;
  /* border-radius: 5rem; */
  /* box-shadow: 1 20px 30px rgba(0, 0, 0, 0.1); */
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
}

.front {
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}

</style>