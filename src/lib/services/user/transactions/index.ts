import { getTransaction } from "./get-transaction.service";
import { listTransactions } from "./list-transactions.service";

const transactionService = {
  listTransactions,
  getTransaction,
};

export default transactionService;
