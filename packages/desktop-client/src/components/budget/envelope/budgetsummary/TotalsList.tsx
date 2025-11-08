import { type CSSProperties } from 'react';
import { Trans } from 'react-i18next';

import { AlignedText } from '@actual-app/components/aligned-text';
import { Block } from '@actual-app/components/block';
import { styles } from '@actual-app/components/styles';
import { Tooltip } from '@actual-app/components/tooltip';
import { View } from '@actual-app/components/view';

import { EnvelopeCellValue } from '@desktop-client/components/budget/envelope/EnvelopeBudgetComponents';
import { CellValueText } from '@desktop-client/components/spreadsheet/CellValue';
import { useFormat } from '@desktop-client/hooks/useFormat';
import { envelopeBudget } from '@desktop-client/spreadsheet/bindings';

import { useTemplateAmounts } from './UnderfundedAmount';

type TotalsListProps = {
  prevMonthName: string;
  month: string;
  style?: CSSProperties;
};

export function TotalsList({ prevMonthName, month, style }: TotalsListProps) {
  const format = useFormat();
  const { underfunded, totalTargets } = useTemplateAmounts(month);

  return (
    <View
      style={{
        flexDirection: 'row',
        lineHeight: 1.5,
        justifyContent: 'center',
        ...styles.smallText,
        ...style,
      }}
    >
      <View
        style={{
          textAlign: 'right',
          marginRight: 10,
          minWidth: 50,
        }}
      >
        <Tooltip
          style={{ ...styles.tooltip, lineHeight: 1.5, padding: '6px 10px' }}
          content={
            <>
              <AlignedText
                left="Income:"
                right={
                  <EnvelopeCellValue
                    binding={envelopeBudget.totalIncome}
                    type="financial"
                  />
                }
              />
              <AlignedText
                left="From Last Month:"
                right={
                  <EnvelopeCellValue
                    binding={envelopeBudget.fromLastMonth}
                    type="financial"
                  />
                }
              />
            </>
          }
          placement="bottom end"
        >
          <EnvelopeCellValue
            binding={envelopeBudget.incomeAvailable}
            type="financial"
          >
            {props => <CellValueText {...props} style={{ fontWeight: 600 }} />}
          </EnvelopeCellValue>
        </Tooltip>

        <EnvelopeCellValue
          binding={envelopeBudget.lastMonthOverspent}
          type="financial"
        >
          {props => (
            <CellValueText
              {...props}
              style={{ fontWeight: 600 }}
              formatter={(value, type) => {
                const v = format(value, type);
                return value > 0 ? '+' + v : value === 0 ? '-' + v : v;
              }}
            />
          )}
        </EnvelopeCellValue>

        <EnvelopeCellValue
          binding={envelopeBudget.totalBudgeted}
          type="financial"
        >
          {props => (
            <CellValueText
              {...props}
              style={{ fontWeight: 600 }}
              formatter={(value, type) => {
                const v = format(value, type);
                return value > 0 ? '+' + v : value === 0 ? '-' + v : v;
              }}
            />
          )}
        </EnvelopeCellValue>

        <EnvelopeCellValue
          binding={envelopeBudget.forNextMonth}
          type="financial"
        >
          {props => (
            <CellValueText
              {...props}
              style={{ fontWeight: 600 }}
              formatter={(value, type) => {
                const v = format(Math.abs(value), type);
                return value >= 0 ? '-' + v : '+' + v;
              }}
            />
          )}
        </EnvelopeCellValue>

        <Block style={{ fontWeight: 600, color: underfunded > 0 ? '#d33' : undefined }}>
          {format(underfunded, 'financial')}
        </Block>

        <Block style={{ fontWeight: 600 }}>
          {format(totalTargets, 'financial')}
        </Block>
      </View>

      <View>
        <Block>
          <Trans>Available funds</Trans>
        </Block>

        <Block>
          <Trans>Overspent in {{ prevMonthName }}</Trans>
        </Block>

        <Block>
          <Trans>Budgeted</Trans>
        </Block>

        <Block>
          <Trans>For next month</Trans>
        </Block>

        <Tooltip
          content="Total amount needed to reach all goal templates for this month"
          placement="bottom end"
        >
          <Block>
            <Trans>Underfunded</Trans>
          </Block>
        </Tooltip>

        <Tooltip
          content="Total amount of all goal templates for this month"
          placement="bottom end"
        >
          <Block>
            <Trans>Total Targets</Trans>
          </Block>
        </Tooltip>
      </View>
    </View>
  );
}
