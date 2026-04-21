import { FC, ReactNode, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { AccountResponse } from '../api/account';
import { colors, radii, spacing } from '../theme';
import { formatCurrency } from '../utils/accountBlocks';
import { Typography } from './Typography';

const LABELS = {
  accountType: 'Type of account',
  accountNumber: 'Account No',
  availableBalance: 'Avaliable Balance',
  dateAdded: 'Date added',
} satisfies Partial<Record<keyof AccountResponse, string>>;

interface Row {
  label: ReactNode;
  value: ReactNode;
}

interface AccountInfoProps {
  data: AccountResponse;
}

export const AccountInfo: FC<AccountInfoProps> = ({ data }) => {
  const rows = useMemo<Row[]>(
    () => [
      {
        label: (
          <Typography variant="bodySmall" color="grey.dark">
            {LABELS.accountType}
          </Typography>
        ),
        value: (
          <Typography variant="bodySmall" color="grey.extraDark" style={styles.value}>
            {data.accountType}
          </Typography>
        ),
      },
      {
        label: (
          <Typography variant="bodySmall" color="grey.dark">
            {LABELS.accountNumber}
          </Typography>
        ),
        value: (
          <Typography variant="bodySmall" color="grey.extraDark" style={styles.value}>
            {data.accountNumber}
          </Typography>
        ),
      },
      {
        label: (
          <Typography variant="bodySmall" color="grey.dark">
            {LABELS.availableBalance}
          </Typography>
        ),
        value: (
          <Typography variant="bodySmall" color="success.color" style={styles.value}>
            {formatCurrency(data.availableBalance, data.currency)}
          </Typography>
        ),
      },
      {
        label: (
          <Typography variant="bodySmall" color="grey.dark">
            {LABELS.dateAdded}
          </Typography>
        ),
        value: (
          <Typography variant="bodySmall" color="grey.extraDark" style={styles.value}>
            {data.dateAdded}
          </Typography>
        ),
      },
    ],
    [data],
  );

  return (
    <View style={styles.card}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.label}
          {row.value}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white.color,
    borderRadius: radii.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl,
    gap: spacing.base,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: { textAlign: 'right' },
});
