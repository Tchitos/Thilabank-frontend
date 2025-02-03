<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold mb-2">ThiLaBank</h1>
      <p class="text-xl text-gray-400">La banque démo</p>
    </div>

    <div class="flex flex-col md:flex-row items-center md:items-stretch w-full max-w-4xl">
      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg w-full md:w-5/12 mb-6 md:mb-0">
        <h2 class="text-2xl font-semibold mb-4 text-center">Connexion</h2>
        <form @submit.prevent="handleLogin" class="flex flex-col space-y-4">
          <div>
            <label class="block text-gray-400 mb-1" for="email">Email *</label>
            <input
              id="email"
              v-model="loginForm.email"
              type="email"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label class="block text-gray-400 mb-1" for="password">Mot de passe *</label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <p v-if="loginError" class="text-red-500 text-sm">{{ loginError }}</p>
          <button
            type="submit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Se connecter
          </button>
        </form>
      </div>

      <div class="hidden md:block w-px bg-gray-700 self-stretch mx-6"></div>

      <div class="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg w-full md:w-8/12">
        <h2 class="text-2xl font-semibold mb-4 text-center">Inscription</h2>
        <form @submit.prevent="handleRegister" class="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="signup-email">Email *</label>
            <input
              id="signup-email"
              v-model="registerForm.email"
              type="email"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="signup-password">Mot de passe *</label>
            <input
              id="signup-password"
              v-model="registerForm.password"
              type="password"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="nom">Nom *</label>
            <input
              id="nom"
              v-model="registerForm.lastName"
              type="text"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="prenom">Prénom *</label>
            <input
              id="prenom"
              v-model="registerForm.firstName"
              type="text"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
              required
            />
          </div>
          <div class="col-span-2">
            <label class="block text-gray-400 mb-1" for="adresse">Adresse postale</label>
            <input
              id="adresse"
              v-model="registerForm.address"
              type="text"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="code-postal">Code postal</label>
            <input
              id="code-postal"
              v-model="registerForm.zipcode"
              type="text"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="ville">Ville</label>
            <input
              id="ville"
              v-model="registerForm.city"
              type="text"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
            />
          </div>
          <div class="col-span-1">
            <label class="block text-gray-400 mb-1" for="telephone">Téléphone</label>
            <input
              id="telephone"
              v-model="registerForm.phone"
              type="tel"
              class="w-full p-2 rounded border border-gray-600 bg-gray-900 text-white focus:ring focus:ring-blue-500"
            />
          </div>
          <p v-if="registerError" class="text-red-500 text-sm col-span-2">{{ registerError }}</p>
          <div class="col-span-2">
            <button
              type="submit"
              class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { apiService } from "@/services/apiService";

export default {
  name: "HomePage",
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        zipcode: "",
        city: "",
      },
      loginError: null,
      registerError: null,
    };
  },
  methods: {
    async handleLogin() {
      try {
        await apiService.postFormUrlEncoded("/users/login", {
          email: this.loginForm.email,
          password: this.loginForm.password,
        });

        alert("Connexion réussie !");
        this.$router.push("/dashboard");
      } catch (error) {
        alert("Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
      }
    },
    async handleRegister() {
      this.registerError = null;
      try {
        await apiService.post("/users/register", this.registerForm);
        alert("Inscription réussie !");
        this.$router.push("/");
      } catch (error) {
        this.registerError = error || "Une erreur est survenue.";
      }
    },
  },
};
</script>
