<template>
  <SidebarLayout>
    <div class="space-y-6">
      <!-- Titre -->
      <div>
        <h1 class="text-3xl font-bold">Mon Profil</h1>
        <hr class="mt-4 border-gray-300" />
      </div>

      <!-- Informations du profil -->
      <div class="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h2 class="text-xl font-bold mb-4">Informations personnelles</h2>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nom et Prénom -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nom -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
                required
                :class="{ 'border-red-500': errors.lastName }"
              />
              <p v-if="errors.lastName" class="text-red-500 text-sm">{{ errors.lastName }}</p>
            </div>

            <!-- Prénom -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
                required
                :class="{ 'border-red-500': errors.firstName }"
              />
              <p v-if="errors.firstName" class="text-red-500 text-sm">{{ errors.firstName }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              required
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</p>
          </div>

          <!-- Adresse -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              id="address"
              v-model="form.address"
              type="text"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              required
              :class="{ 'border-red-500': errors.address }"
            />
            <p v-if="errors.address" class="text-red-500 text-sm">{{ errors.address }}</p>
          </div>

          <!-- Ville et Code Postal -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Ville -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">Ville</label>
              <input
                id="city"
                v-model="form.city"
                type="text"
                class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
                required
                :class="{ 'border-red-500': errors.city }"
              />
              <p v-if="errors.city" class="text-red-500 text-sm">{{ errors.city }}</p>
            </div>

            <!-- Code Postal -->
            <div>
              <label for="zipcode" class="block text-sm font-medium text-gray-700">Code postal</label>
              <input
                id="zipcode"
                v-model="form.zipcode"
                type="text"
                class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
                required
                :class="{ 'border-red-500': errors.zipcode }"
              />
              <p v-if="errors.zipcode" class="text-red-500 text-sm">{{ errors.zipcode }}</p>
            </div>
          </div>

          <!-- Numéro de téléphone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              required
              :class="{ 'border-red-500': errors.phone }"
            />
            <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Laissez vide pour ne pas changer"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</p>
          </div>

          <!-- Créé le -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Créé le</label>
            <input
              type="text"
              :value="form.createdAt"
              class="mt-1 p-2 w-full border border-gray-300 rounded bg-gray-100 text-gray-500"
              disabled
            />
          </div>

          <!-- Boutons -->
          <div class="flex justify-between items-center">
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Sauvegarder les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  </SidebarLayout>
</template>

<script>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import { apiService } from "@/services/apiService";

export default {
  name: "ProfilePage",
  components: {
    SidebarLayout,
  },
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipcode: "",
        password: null,
        createdAt: "",
      },
      errors: {},
    };
  },
  async mounted() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const profile = await apiService.get("/users/me");
        this.form = { ...profile, password: "" };
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
        alert("Impossible de charger les informations du profil.");
      }
    },
    async handleSubmit() {
      if (this.form.password != "" && this.form.password.length < 4) {
        alert("Le mot de passe doit contenir au moins 4 caractères.");
        return;
      }
      if (this.form.password === "") {
        this.form.password = null;
      }

      try {
        await apiService.put("/users/me", this.form);
        alert("Profil mis à jour avec succès !");
        this.form.password = "";
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil :", error);
        alert(error.message || "Une erreur est survenue.");
      }
    },
  },
};
</script>
