import InvestBudgetCard from "./components/invest/InvestBudgetCard";

function InvestPage() {
  return (
    <div className="flex flex-col gap-6">
      <InvestBudgetCard totalBudget={1000000} remainingBudget={1000000} />
    </div>
  );
}

export default InvestPage;
