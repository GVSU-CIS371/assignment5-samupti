<template>
  <div class="app">
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />

    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="b in beverageStore.bases" :key="b.id">
          <label>
            <input
              type="radio"
              name="bases"
              :value="b"
              v-model="beverageStore.currBase"
            />
            {{ b.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="s in beverageStore.syrups" :key="s.id">
          <label>
            <input
              type="radio"
              name="syrups"
              :value="s"
              v-model="beverageStore.currSyrup"
            />
            {{ s.name }}
          </label>
        </template>
      </li>
    </ul>

    <ul>
      <li>
        <template v-for="c in beverageStore.creamers" :key="c.id">
          <label>
            <input
              type="radio"
              name="creamers"
              :value="c"
              v-model="beverageStore.currCreamer"
            />
            {{ c.name }}
          </label>
        </template>
      </li>
    </ul>

    <div v-if="beverageStore.user" class="signed-row">
      <span>
        Signed in as {{ beverageStore.user.displayName || beverageStore.user.email }}
      </span>
      <button @click="logout">Sign out</button>
    </div>

    <div v-else class="signin-row">
      <button @click="withGoogle">Sign in with Google</button>
    </div>

    <div class="controls">
      <input
        type="text"
        placeholder="Beverage Name"
        v-model="beverageStore.bevName"
      />
      <button
        @click="beverageStore.makeBeverage()"
        :disabled="!beverageStore.user"
      >
        🍺 Make Beverage
      </button>
    </div>

    <p v-if="!beverageStore.user" class="signin-message">
      Please sign in to save your beverage.
    </p>

    <p v-if="beverageStore.message" class="message">
      {{ beverageStore.message }}
    </p>

      <div
  v-if="beverageStore.user && beverageStore.beverages.length > 0"
  class="saved-section">
  
  <div class="saved-list">
    <label
      v-for="bev in beverageStore.beverages"
      :key="bev.id"
      class="saved-item"
    >
      <input
        type="radio"
        name="saved-beverages"
        :checked="beverageStore.currentBeverage?.id === bev.id"
        @change="beverageStore.showBeverage(bev)"
      />
      {{ bev.name }}
    </label>
  </div>
</div>
</div>

</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { auth, googleProvider } from "./firebase";

const beverageStore = useBeverageStore();

async function withGoogle() {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error(error);
    beverageStore.setMessage("Google sign-in failed.");
  }
}

async function logout() {
  try {
    await signOut(auth);
    beverageStore.setMessage("Signed out");
  } catch (error) {
    console.error(error);
    beverageStore.setMessage("Sign out failed.");
  }
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    beverageStore.setUser(user);
  });
});
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}

ul {
  list-style: none;
  padding-left: 0;
}

.app {
  text-align: left;
}

.signed-row,
.signin-row {
  margin-top: 0.35rem;
  margin-bottom: 0.1rem;
}

.signed-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0;
  margin-top: 0;
}

.controls input,
.controls button {
  margin: 0;
}

.message {
  margin-top: 0.75rem;
  font-weight: 400;
}

.saved-section {
  margin-top: 1rem;
}
</style>