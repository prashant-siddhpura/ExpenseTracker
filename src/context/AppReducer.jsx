export default (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        ),
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "SET_SELECTED_MONTH":
      return { ...state, selectedMonth: action.payload };
    case "SET_SELECTED_YEAR":
      return { ...state, selectedYear: action.payload };
    case "ADD_BUDGET":
      const existingBudgetIndex = state.budgets.findIndex(
        (b) =>
          b.category === action.payload.category &&
          b.month === action.payload.month &&
          b.year === action.payload.year
      );
      if (existingBudgetIndex !== -1) {
        const updatedBudgets = [...state.budgets];
        updatedBudgets[existingBudgetIndex] = action.payload;
        return { ...state, budgets: updatedBudgets };
      }
      return { ...state, budgets: [action.payload, ...state.budgets] };
    case "SET_BUDGETS": // Add this
      return { ...state, budgets: action.payload };
    case "DELETE_BUDGET": // Add this
      return {
        ...state,
        budgets: state.budgets.filter((budget) => budget.id !== action.payload),
      };
    case "SET_USER_SETTINGS":
      return { ...state, userSettings: { ...state.userSettings, ...action.payload } };
    default:
      return state;
  }
};
