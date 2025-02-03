<template>
  <SidebarLayout>
    <div class="space-y-6">
      <!-- Titre -->
      <div>
        <h1 class="text-3xl font-bold">Dépôt / Retrait</h1>
        <hr class="mt-4 border-gray-300" />
      </div>

      <!-- Formulaire Dépôt / Retrait -->
      <div class="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h2 class="text-xl font-bold mb-4">Ajouter une transaction</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Titre -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Titre*</label>
            <input
              id="title"
              v-model="form.description"
              type="text"
              placeholder="Ex : Salaire, Achat, etc."
              maxlength="12"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <!-- Montant -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Montant*</label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              min="0"
              max="1000000"
              placeholder="Ex : 1000"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              required
            />
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <div class="flex items-center space-x-4 mt-1">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="DEPOSIT"
                  v-model="form.type"
                  class="form-radio"
                />
                <span class="ml-2">Revenu</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="WITHDRAWAL"
                  v-model="form.type"
                  class="form-radio"
                />
                <span class="ml-2">Dépense</span>
              </label>
            </div>
          </div>

          <!-- Choix du compte -->
          <div>
            <label for="account" class="block text-sm font-medium text-gray-700">Compte</label>
            <select
              id="account"
              v-model="form.toAccountNumber"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              required
            >
              <option disabled value="">Sélectionnez un compte</option>
              <option v-for="account in accounts" :key="account.accountNumber" :value="account.accountNumber">
                {{ account.type }} | {{ account.accountNumber }}
              </option>
            </select>
          </div>

          <!-- Bouton Submit -->
          <div>
            <button
              type="submit"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Ajouter la transaction
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
  name: "TransactionsPage",
  components: {
    SidebarLayout,
  },
  data() {
    return {
      form: {
        description: "",
        amount: "",
        type: "DEPOSIT",
        toAccountNumber: "",
        currency: "EUR",
      },
      accounts: [],
    };
  },
  mounted() {
    this.fetchAccounts();
  },
  methods: {
    async fetchAccounts() {
      try {
        const accounts = await apiService.get("/accounts");
        this.accounts = accounts;
      } catch (error) {
        console.error("Erreur lors du chargement des comptes :", error);
        alert("Impossible de charger les comptes. Veuillez réessayer plus tard.");
      }
    },
    async handleSubmit() {
      if (!this.form.description || !this.form.amount || !this.form.toAccountNumber) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      try {
        await apiService.post("/transactions", {
          transactionType : this.form.type,
          toAccountNumber: this.form.type === "DEPOSIT" ? this.form.toAccountNumber : null,
          fromAccountNumber: this.form.type === "WITHDRAWAL" ? this.form.toAccountNumber : null,
          amount: this.form.amount,
          currency: "EUR",
          description: this.form.description,
        });

        alert("Transaction ajoutée avec succès !");
        this.resetForm();
      } catch (error) {
        alert(error);
      }
    },
    resetForm() {
      this.form = {
        description: "",
        amount: "",
        type: "income",
        toAccountNumber: "",
        currency: "EUR",
      };
    },
  },
};
</script>
