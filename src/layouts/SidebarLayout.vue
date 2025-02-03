<template>
  <div class="flex min-h-screen bg-gray-100 text-gray-800 relative">
    <!-- Bouton Menu (Mobile) -->
    <button 
      class="fixed top-4 right-4 z-50 bg-gray-900 text-white p-2 rounded md:hidden"
      @click="toggleSidebar"
    >
      <span class="material-icons">menu</span>
    </button>

    <!-- Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="w-64 bg-gray-900 text-white flex flex-col h-screen fixed top-0 right-0 z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0"
      :class="{ 'translate-x-full': !isSidebarOpen, 'translate-x-0': isSidebarOpen }"
    >
      <div class="p-4 text-center text-2xl font-bold border-b border-gray-700">
        ThiLaBank
      </div>
      
      <nav class="flex-1 p-4 space-y-4">
        <router-link
          to="/dashboard"
          class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700"
          :class="{ 'bg-gray-700': isActive('/dashboard') }"
          @click="isSidebarOpen = false"
        >
          <span class="material-icons">dashboard</span>
          <span>Tableau de bord</span>
        </router-link>
        <router-link
          to="/transactions"
          class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700"
          :class="{ 'bg-gray-700': isActive('/transactions') }"
          @click="isSidebarOpen = false"
        >
          <span class="material-icons">attach_money</span>
          <span>Dépôt / Retrait</span>
        </router-link>
        <router-link
          to="/transfer"
          class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700"
          :class="{ 'bg-gray-700': isActive('/transfer') }"
          @click="isSidebarOpen = false"
        >
          <span class="material-icons">swap_horiz</span>
          <span>Virement</span>
        </router-link>
        <router-link
          to="/profile"
          class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700"
          :class="{ 'bg-gray-700': isActive('/profile') }"
          @click="isSidebarOpen = false"
        >
          <span class="material-icons">person</span>
          <span>Mon profil</span>
        </router-link>
      </nav>
      
      <button
        class="flex items-center space-x-2 p-4 bg-red-600 hover:bg-red-700 text-white text-left"
        @click="logout"
      >
        <span class="material-icons">power_settings_new</span>
        <span>Se déconnecter</span>
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>

<script>
import { apiService } from "@/services/apiService";

export default {
  name: "UserLayout",
  data() {
    return {
      isSidebarOpen: false,
    };
  },
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async logout() {
      try {
        await apiService.post("/users/logout");
        alert("Vous avez été déconnecté.");
        this.$router.push("/");
      } catch (error) {
        alert("Une erreur est survenue lors de la déconnexion.");
      }
    },
  },
};
</script>

<style>
@media (max-width: 768px) {
  aside {
    width: 16rem;
  }
}
</style>
