<template>
  <SidebarLayout>
    <div class="space-y-6">
      <!-- Titre -->
      <div>
        <h1 class="text-3xl font-bold">Tableau de bord</h1>
        <hr class="mt-4 border-gray-300" />
      </div>

      <!-- 4 Cartes colorées -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="flex justify-between items-center p-4 bg-blue-500 text-white rounded shadow relative">
          <div>
            <p class="text-sm">Total des comptes</p>
            <p class="text-2xl font-bold">{{ totalAccountsAmount.toFixed(2) }} €</p>
          </div>
          <div class="absolute inset-y-0 right-4 flex items-center">
            <span class="material-icons text-6xl text-blue-200">account_balance</span>
          </div>
        </div>
        <div class="flex justify-between items-center p-4 bg-green-500 text-white rounded shadow relative">
          <div>
            <p class="text-sm">Nombre de comptes</p>
            <p class="text-2xl font-bold">{{ accountCount }}</p>
          </div>
          <div class="absolute inset-y-0 right-4 flex items-center">
            <span class="material-icons text-6xl text-green-200">credit_card</span>
          </div>
        </div>
        <div class="flex justify-between items-center p-4 bg-yellow-500 text-white rounded shadow relative">
          <div>
            <p class="text-sm">Revenus ce mois-ci</p>
            <p class="text-2xl font-bold">{{ totalMonthlyRevenue.toFixed(2) }} €</p>
          </div>
          <div class="absolute inset-y-0 right-4 flex items-center">
            <span class="material-icons text-6xl text-yellow-200">trending_up</span>
          </div>
        </div>
        <div class="flex justify-between items-center p-4 bg-red-500 text-white rounded shadow relative">
          <div>
            <p class="text-sm">Dépenses ce mois-ci</p>
            <p class="text-2xl font-bold">{{ totalMonthlyExpenses.toFixed(2) }} €</p>
          </div>
          <div class="absolute inset-y-0 right-4 flex items-center">
            <span class="material-icons text-6xl text-red-200">warning</span>
          </div>
        </div>
      </div>

      <!-- Cartes des comptes -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="(account, index) in accounts"
          :key="index"
          class="p-4 bg-white rounded border border-gray-300 shadow cursor-pointer hover:bg-gray-200"
          @click="openAccountModal(account)"
        >
          <h2 class="text-xl font-semibold">{{ account.type }}</h2>
          <p class="text-gray-600">{{ account.accountNumber }}</p>
          <p class="text-lg font-bold">{{ account.balance.toFixed(2) }} €</p>
        </div>

        <!-- Ajouter un compte -->
        <div
          class="p-4 bg-white rounded border-2 border-dashed border-gray-300 text-center cursor-pointer"
          @click="openModal"
        >
          <p class="text-green-500 text-2xl font-bold">+</p>
          <p class="text-gray-600">Ajouter un compte</p>
        </div>
      </div>

      <!-- Liste et graphique -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Dernières transactions -->
        <div class="p-4 bg-white rounded shadow">
          <h2 class="text-xl font-bold mb-4">Dernières transactions</h2>
          <div class="overflow-x-auto">
            <table class="w-full table-auto text-left border-collapse">
              <thead>
                <tr class="border-b">
                  <th class="p-2">Date</th>
                  <th class="p-2">Montant</th>
                  <th class="p-2">Description</th>
                  <th class="p-2">Compte</th>
                  <th class="p-2">Transaction</th>
                  <th class="p-2">Tiers</th>
                </tr>
              </thead>
                <tbody>
                <tr v-for="(transfer, index) in latestTransfers" :key="index" class="border-b">
                  <td class="p-2">{{ new Date(transfer.createdAt).toLocaleDateString() }}</td>
                  <td class="p-2">{{ transfer.amount }} €</td>
                  <td class="p-2">{{ transfer.description || 'N/A' }}</td>
                  <td class="p-2">{{ getOwnedAccountNumber(transfer) }}</td>
                  <td class="p-2 flex items-center space-x-1"
                    :class="{
                      'text-gray-700': isInternalTransfer(transfer),
                      'text-red-500': isOutgoing(transfer),
                      'text-green-500': isIncoming(transfer),
                    }">
                    <span class="material-icons">
                      {{ getTransactionIcon(transfer) }}
                    </span>
                    <span>{{ getTransactionLabel(transfer) }}</span>
                  </td>
                  <td class="p-2">{{ getCounterpartyAccountNumber(transfer) || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Graphique des revenus / dépenses -->
        <div class="p-4 bg-white rounded shadow">
          <h2 class="text-xl font-bold mb-4">Revenus et Dépenses</h2>
          <canvas id="chart"></canvas>
        </div>
      </div>

      <!-- Modal de création de compte -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Créer un compte</h2>
          <form @submit.prevent="handleCreateAccount">
            <div class="mb-4">
              <label for="accountType" class="block text-sm font-medium text-gray-700">Type de compte</label>
              <select
                id="accountType"
                v-model="form.type"
                class="mt-1 p-2 w-full border border-gray-300 rounded focus:ring focus:ring-blue-500"
                required
              >
                <option disabled value="">Sélectionnez un type</option>
                <option value="COURANT">Compte Courant</option>
                <option value="EPARGNE">Compte Épargne</option>
                <option value="LIVRET">Livret</option>
              </select>
            </div>
            <div class="flex justify-end space-x-4">
              <button type="button" class="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded" @click="closeModal">
                Annuler
              </button>
              <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Créer
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal de transactions d'un compte -->
      <div v-if="showAccountModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
          <!-- Titre -->
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">Transactions du compte</h2>
            <button @click="closeAccountModal" class="text-gray-500 hover:text-gray-700">
              <span class="material-icons">close</span>
            </button>
          </div>

          <!-- Numéro de compte -->
          <p class="text-gray-700 mt-2 mb-4">Compte: {{ selectedAccount.accountNumber }}</p>

          <!-- Bouton suppression -->
          <button @click="handleDeleteAccount" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4">
            Supprimer le compte
          </button>

          <!-- Tableau des transactions -->
          <div class="overflow-x-auto">
            <table class="w-full table-auto text-left border-collapse">
              <thead>
                <tr class="border-b">
                  <th class="p-2">Date</th>
                  <th class="p-2">Montant</th>
                  <th class="p-2">Description</th>
                  <th class="p-2">Type</th>
                  <th class="p-2">Tiers</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(transaction, index) in paginatedTransactions()" :key="index" class="border-b">
                  <td class="p-2">{{ new Date(transaction.createdAt).toLocaleDateString() }}</td>
                  <td class="p-2">{{ transaction.amount }} €</td>
                  <td class="p-2">{{ transaction.description || 'N/A' }}</td>
                  <td class="p-2 flex items-center space-x-1"
                    :class="{
                      'text-gray-700': isInternalTransfer(transaction),
                      'text-red-500': isOutgoing(transaction),
                      'text-green-500': isIncoming(transaction),
                    }">
                    <span class="material-icons">
                      {{ getTransactionIcon(transaction) }}
                    </span>
                    <span>{{ getTransactionLabel(transaction) }}</span>
                  </td>
                  <td class="p-2">{{ getCounterpartyAccountNumber(transaction) || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
              Précédent
            </button>
            <span>Page {{ currentPage }}</span>
            <button @click="nextPage"
              :disabled="currentPage * itemsPerPage >= transactionsForSelectedAccount.length"
              class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
              Suivant
            </button>
          </div>
        </div>
      </div>

    </div>
  </SidebarLayout>
</template>

<script>
import SidebarLayout from "@/layouts/SidebarLayout.vue";
import Chart from "chart.js/auto";
import { apiService } from "@/services/apiService";

export default {
  name: "DashboardPage",
  components: { SidebarLayout },
  data() {
    return {
      accounts: [],
      transfers: [],
      form: { type: "" },
      showModal: false,
      showAccountModal: false,
      selectedAccount: null,
      transactionsForSelectedAccount: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    totalAccountsAmount() {
      return this.accounts.reduce((sum, account) => sum + (account.balance || 0), 0);
    },
    accountCount() {
      return this.accounts.length;
    },
    totalMonthlyRevenue() {
      return this.getMonthlyData("REVENUE").reduce((sum, value) => sum + value, 0);
    },
    totalMonthlyExpenses() {
      return this.getMonthlyData("EXPENSE").reduce((sum, value) => sum + value, 0);
    },
    latestTransfers() {
      return this.transfers.slice(0, 10);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.accounts = await apiService.get("/accounts");
        this.transfers = await apiService.get("/transactions");
        this.renderChart();
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
        alert("Impossible de charger les données.");
      }
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const ctx = document.getElementById("chart").getContext("2d");
      const monthlyRevenue = this.getMonthlyData("REVENUE");
      const monthlyExpenses = this.getMonthlyData("EXPENSE");
      const internalTransfers = this.getMonthlyData("INTERNAL");

      this.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
          ],
          datasets: [
            {
              label: "Revenus",
              data: monthlyRevenue,
              backgroundColor: "rgba(34,197,94,0.7)", // Vert
            },
            {
              label: "Dépenses",
              data: monthlyExpenses,
              backgroundColor: "rgba(239,68,68,0.7)", // Rouge
            },
            {
              label: "Transferts internes",
              data: internalTransfers,
              backgroundColor: "rgba(128,128,128,0.7)", // Gris
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
        },
      });
    },
    getTransactionLabel(transfer) {
      if (this.isInternalTransfer(transfer)) return "Transfert";
      return this.isIncoming(transfer) ? "Entrant" : "Sortant";
    },
    getTransactionIcon(transfer) {
      if (this.isInternalTransfer(transfer)) return "swap_horiz";
      return this.isIncoming(transfer) ? "arrow_back" : "arrow_forward";
    },
    isInternalTransfer(transfer) {
      return this.accounts.some(acc => acc.accountNumber === transfer.fromAccountNumber) &&
             this.accounts.some(acc => acc.accountNumber === transfer.toAccountNumber);
    },
    isOutgoing(transfer) {
      return transfer.transactionType === "WITHDRAWAL" ||
             (transfer.transactionType === "TRANSFER" &&
              this.accounts.some(acc => acc.accountNumber === transfer.fromAccountNumber) &&
              !this.accounts.some(acc => acc.accountNumber === transfer.toAccountNumber));
    },
    isIncoming(transfer) {
      return transfer.transactionType === "DEPOSIT" ||
             (transfer.transactionType === "TRANSFER" &&
              !this.accounts.some(acc => acc.accountNumber === transfer.fromAccountNumber) &&
              this.accounts.some(acc => acc.accountNumber === transfer.toAccountNumber));
    },
    getOwnedAccountNumber(transfer) {
      return this.accounts.some(acc => acc.accountNumber === transfer.fromAccountNumber)
        ? transfer.fromAccountNumber
        : transfer.toAccountNumber;
    },
    getCounterpartyAccountNumber(transfer) {      
      if (transfer.transactionType === "WITHDRAWAL") {
        return "Retrait"
      } else if (transfer.transactionType === "DEPOSIT") {
        return "Dépôt"
      }
      return this.accounts.some(acc => acc.accountNumber === transfer.fromAccountNumber)
        ? transfer.toAccountNumber
        : transfer.fromAccountNumber;
    },
    getMonthlyData(type) {
      const monthlyData = Array(12).fill(0);
      this.transfers.forEach((transfer) => {
        const month = new Date(transfer.createdAt).getMonth();

        // Vérification de l'appartenance des comptes
        const ownedAccounts = this.accounts.map(acc => acc.accountNumber);
        const isFromOwned = ownedAccounts.includes(transfer.fromAccountNumber);
        const isToOwned = ownedAccounts.includes(transfer.toAccountNumber);

        if (type === "REVENUE" && (transfer.transactionType === "DEPOSIT" || (transfer.transactionType === "TRANSFER" && isToOwned && !isFromOwned))) {
          monthlyData[month] += transfer.amount || 0;
        }
        if (type === "EXPENSE" && (transfer.transactionType === "WITHDRAWAL" || (transfer.transactionType === "TRANSFER" && isFromOwned && !isToOwned))) {
          monthlyData[month] += transfer.amount || 0;
        }
        if (type === "INTERNAL" && transfer.transactionType === "TRANSFER" && isFromOwned && isToOwned) {
          monthlyData[month] += transfer.amount || 0;
        }
      });
      return monthlyData;
    },
    async handleCreateAccount() {
      try {
        const response = await apiService.post("/accounts", this.form);
        this.accounts.push({
          accountNumber: response.accountNumber,
          type: response.type,
          balance: response.balance,
        });
        alert("Compte créé avec succès !");
        this.closeModal();
      } catch (error) {
        console.error("Erreur lors de la création du compte :", error);
        alert("Erreur lors de la création du compte. Veuillez réessayer.");
      }
    },
    resetForm() {
      this.form = {
        type: "",
      };
    },
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openAccountModal(account) {
      this.selectedAccount = account;
      this.showAccountModal = true;

      this.transactionsForSelectedAccount = this.transfers.filter(
        (transaction) =>
          transaction.fromAccountNumber === account.accountNumber ||
          transaction.toAccountNumber === account.accountNumber
      );

      this.currentPage = 1;
    },

    closeAccountModal() {
      this.showAccountModal = false;
      this.selectedAccount = null;
    },

    async handleDeleteAccount() {
      const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce compte ?");
      if (!confirmDelete) return;

      try {
        await apiService.delete(`/accounts/${this.selectedAccount.accountNumber}`);

        this.fetchData();

        this.closeAccountModal();
        alert("Compte supprimé avec succès !");
      } catch (error) {
        console.error("Erreur lors de la suppression du compte :", error);
        alert("Une erreur est survenue lors de la suppression du compte.");
      }
    },

    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.transactionsForSelectedAccount.slice(start, end);
    },

    nextPage() {
      if (this.currentPage * this.itemsPerPage < this.transactionsForSelectedAccount.length) {
        this.currentPage++;
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>
