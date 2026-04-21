import { FC } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import type { AccountTransaction } from '../api/account';
import { colors, radii, spacing } from '../theme';
import { formatAmount } from '../utils/accountBlocks';
import { Typography } from './Typography';

const CHEVRON = require('../../assets/chevron.png');
const TRANSACTIONS_LIMIT = 4;

interface AccountTransactionsProps {
  transactions: AccountTransaction[];
  currency: string;
}

export const AccountTransactions: FC<AccountTransactionsProps> = ({
  transactions,
  currency,
}) => {
  const items = transactions.slice(0, TRANSACTIONS_LIMIT);
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Typography variant="caption" style={styles.headerTitle}>
          Recent Transactions
        </Typography>
        <Pressable accessibilityRole="button" hitSlop={10} style={styles.chevronChip}>
          <Image source={CHEVRON} style={styles.chevron} resizeMode="contain" />
        </Pressable>
      </View>
      <View style={styles.list}>
        {items.map((tx, i) => (
          <View key={i} style={styles.tx}>
            <View style={styles.avatar}>
              <Typography variant="captionBig" color="tertiary.color">
                {tx.name.slice(0, 1).toUpperCase()}
              </Typography>
            </View>
            <View style={styles.mid}>
              <Typography variant="captionBig">{tx.name}</Typography>
              <Typography variant="captionRegular" style={styles.subtitle}>
                {`${tx.bank} ${tx.time}`}
              </Typography>
            </View>
            <Typography
              variant="bodySmall"
              color={tx.amount > 0 ? 'success.color' : 'grey.extraDark'}
              style={styles.amount}
            >
              {formatAmount(tx.amount, currency)}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white.color,
    borderRadius: radii.input,
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { opacity: 0.75 },
  chevronChip: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 6,
    height: 9,
    tintColor: colors.grey.extraDark,
    transform: [{ rotate: '180deg' }],
  },
  list: { gap: spacing.xl },
  tx: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: radii.avatar,
    backgroundColor: colors.white.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: { flex: 1, gap: 4 },
  subtitle: { opacity: 0.5 },
  amount: { textAlign: 'right', width: 90 },
});
