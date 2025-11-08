import { useEffect, useState } from 'react';

import { useEnvelopeSheetValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';
import { send } from 'loot-core/platform/client/fetch';

type TemplateAmounts = {
  underfunded: number;
  totalTargets: number;
};

// Custom hook to fetch underfunded amount and total targets
export function useTemplateAmounts(month: string): TemplateAmounts {
  const [underfundedAmount, setUnderfundedAmount] = useState<number>(0);
  const [totalTargets, setTotalTargets] = useState<number>(0);

  // Watch for changes to the budget - when budgets change, this will trigger a re-fetch
  const toBudgetValue = useEnvelopeSheetValue({
    name: envelopeBudget.toBudget,
    value: 0,
  });

  useEffect(() => {
    async function loadAmounts() {
      try {
        const [underfunded, targets] = await Promise.all([
          send('budget/get-total-underfunded', { month }),
          send('budget/get-total-targets', { month }),
        ]);
        setUnderfundedAmount(underfunded);
        setTotalTargets(targets);
      } catch (error) {
        console.error('Failed to load template amounts:', error);
        setUnderfundedAmount(0);
        setTotalTargets(0);
      }
    }

    loadAmounts();
  }, [month, toBudgetValue]);

  return {
    underfunded: underfundedAmount,
    totalTargets,
  };
}
