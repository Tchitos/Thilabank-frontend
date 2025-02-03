<template>
  <SidebarLayout>
    <div class="space-y-6">
      <!-- Titre -->
      <div>
        <h1 class="text-3xl font-bold">Virement</h1>
        <hr class="mt-4 border-gray-300" />
      </div>

      <!-- Formulaire Virement -->
      <div class="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h2 class="text-xl font-bold mb-4">Effectuer un virement</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Titre -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Titre</label>
            <input
              id="description"
              v-model="form.description"
              type="text"
              placeholder="Ex : Loyer, Facture, etc."
              maxlength="12"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              :class="{ 'border-red-500': errors.description }"
            />
            <p v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</p>
          </div>

          <!-- Montant -->
          <div>
            <label for="amount" class="block text-sm font-medium text-gray-700">Montant</label>
            <input
              id="amount"
              v-model.number="form.amount"
              type="number"
              placeholder="Ex : 1000"
              min="0"
              max="1000000"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              :class="{ 'border-red-500': errors.amount }"
            />
            <p v-if="errors.amount" class="text-red-500 text-sm">{{ errors.amount }}</p>
          </div>

          <!-- Source -->
          <div>
            <label for="fromAccount" class="block text-sm font-medium text-gray-700">Depuis le compte</label>
            <select
              id="fromAccount"
              v-model="form.fromAccountNumber"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              :class="{ 'border-red-500': errors.fromAccountNumber }"
            >
              <option disabled value="">Sélectionnez un compte</option>
              <option v-for="account in accounts" :key="account.id" :value="account.accountNumber">
                {{ account.type }} - {{ account.accountNumber }}
              </option>
            </select>
            <p v-if="errors.fromAccountNumber" class="text-red-500 text-sm">{{ errors.fromAccountNumber }}</p>
          </div>

          <!-- Type de transfert -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Type de transfert</label>
            <div class="flex items-center space-x-4 mt-1">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="transferType"
                  value="own"
                  v-model="form.transferType"
                  class="form-radio"
                />
                <span class="ml-2">Mes comptes</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="transferType"
                  value="thirdParty"
                  v-model="form.transferType"
                  class="form-radio"
                />
                <span class="ml-2">Vers tiers</span>
              </label>
            </div>
          </div>

          <!-- Destinataire -->
          <div v-if="form.transferType === 'own'">
            <label for="toAccount" class="block text-sm font-medium text-gray-700">Vers le compte</label>
            <select
              id="toAccount"
              v-model="form.toAccountNumber"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              :class="{ 'border-red-500': errors.toAccountNumber }"
            >
              <option disabled value="">Sélectionnez un compte</option>
              <option
                v-for="account in accounts.filter((acc) => acc.accountNumber !== form.fromAccountNumber)"
                :key="account.id"
                :value="account.accountNumber"
              >
                {{ account.type }} - {{ account.accountNumber }}
              </option>
            </select>
            <p v-if="errors.toAccountNumber" class="text-red-500 text-sm">{{ errors.toAccountNumber }}</p>
          </div>

          <!-- Compte tiers -->
          <div v-if="form.transferType === 'thirdParty'">
            <label for="thirdPartyAccount" class="block text-sm font-medium text-gray-700">Numéro de compte tiers</label>
            <input
              id="thirdPartyAccount"
              v-model="form.toAccountNumber"
              type="text"
              placeholder="Ex : 123456789"
              class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
              :class="{ 'border-red-500': errors.toAccountNumber }"
            />
            <p v-if="errors.toAccountNumber" class="text-red-500 text-sm">{{ errors.toAccountNumber }}</p>
          </div>

          <!-- Bouton de soumission -->
          <div>
            <button
              type="submit"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Effectuer le virement
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
  name: "TransferPage",
  components: {
    SidebarLayout,
  },
  data() {
    return {
      form: {
        description: "",
        amount: "",
        fromAccountNumber: "",
        toAccountNumber: "",
        transferType: "own",
        currency: "EUR",
      },
      errors: {},
      accounts: [],
    };
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.accounts = await apiService.get("/accounts");
      } catch (error) {
        alert("Erreur lors du chargement des données");
      }
    },
    validateForm() {
      this.errors = {};

      if (!this.form.description) {
        this.errors.description = "Le titre est obligatoire.";
      }
      if (!this.form.amount || this.form.amount <= 0) {
        this.errors.amount = "Veuillez entrer un montant valide.";
      }
      if (!this.form.fromAccountNumber) {
        this.errors.fromAccountNumber = "Veuillez sélectionner un compte source.";
      }
      if (!this.form.toAccountNumber) {
        this.errors.toAccountNumber = "Veuillez entrer un compte destinataire valide.";
      }

      return Object.keys(this.errors).length === 0;
    },
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      try {
        const data = {
          transactionType: "TRANSFER",
          description: this.form.description,
          amount: this.form.amount,
          fromAccountNumber: this.form.fromAccountNumber,
          toAccountNumber: this.form.toAccountNumber,
          currency: "EUR",
        };

        await apiService.post("/transactions", data);

        alert("Virement effectué avec succès !");
        this.resetForm();
      } catch (error) {
        console.error("Erreur lors de l'envoi du virement :", error);
        alert(error || "Une erreur est survenue.");
      }
    },
    resetForm() {
      this.form = {
        description: "",
        amount: "",
        fromAccountNumber: "",
        toAccountNumber: "",
        transferType: "own",
      };
    },
  },
};
</script>
