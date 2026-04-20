import { FC, Fragment } from 'react';
import { Image, ImageSourcePropType, Linking, Pressable, StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../theme';
import { Button } from './Button';
import { Typography, TypographyColor, TypographyVariant } from './Typography';

const CHEVRON = require('../../assets/chevron.png');

// ── Rendering domain types (owned by the renderer that consumes them) ───────

export interface InfoRow {
  label: string;
  value: string;
  tone?: 'default' | 'success';
}

export interface TransactionItem {
  name: string;
  subtitle: string;
  amount: string;
  positive?: boolean;
  initial?: string;
}

export type BlockAction = { kind: 'url'; href: string } | { kind: 'logout' };

export type AccountBlock =
  | { type: 'profile'; title: string; icon?: ImageSourcePropType; initials?: string }
  | { type: 'infoCard'; rows: InfoRow[] }
  | { type: 'transactionsCard'; title: string; items: TransactionItem[] }
  | { type: 'text'; value: string; variant?: 'h1' | 'h2' | 'body' | 'caption' }
  | { type: 'button'; label: string; action: BlockAction }
  | { type: 'divider' }
  | { type: 'spacer'; size: number };

export interface BlockRendererProps {
  blocks: AccountBlock[];
  onLogout?: () => void;
}

export const BlockRenderer: FC<BlockRendererProps> = ({ blocks, onLogout }) => {
  return (
    <View style={styles.stack}>
      {blocks.map((block, i) => (
        <Fragment key={i}>{renderBlock(block, onLogout)}</Fragment>
      ))}
    </View>
  );
};

function renderBlock(block: AccountBlock, onLogout?: () => void) {
  switch (block.type) {
    case 'profile':
      return <ProfileBlock title={block.title} icon={block.icon} initials={block.initials} />;
    case 'infoCard':
      return <InfoCardBlock rows={block.rows} />;
    case 'transactionsCard':
      return <TransactionsCardBlock title={block.title} items={block.items} />;
    case 'text': {
      const { variant, color } = getTextStyles(block.variant);
      return (
        <Typography variant={variant} color={color}>
          {block.value}
        </Typography>
      );
    }
    case 'button':
      return (
        <View style={styles.buttonWrap}>
          <Button
            label={block.label}
            onPress={() => {
              if (block.action.kind === 'url') Linking.openURL(block.action.href);
              else onLogout?.();
            }}
          />
        </View>
      );
    case 'divider':
      return <View style={styles.divider} />;
    case 'spacer':
      return <View style={{ height: block.size }} />;
    default: {
      // Exhaustive check — adding a new AccountBlock variant will produce a
      // compile-time error here until this switch handles it.
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

interface ProfileBlockProps {
  title: string;
  icon?: ImageSourcePropType;
  initials?: string;
}

const ProfileBlock: FC<ProfileBlockProps> = ({ title, icon, initials }) => {
  return (
    <View style={styles.profile}>
      {icon ? (
        <Image source={icon} style={styles.profileImage} resizeMode="contain" />
      ) : (
        <View style={styles.profileIcon}>
          <Typography variant="captionBig" color="white.color">
            {initials ?? title.slice(0, 1)}
          </Typography>
        </View>
      )}
      <Typography variant="captionBig">{title}</Typography>
    </View>
  );
};

interface InfoCardBlockProps {
  rows: InfoRow[];
}

const InfoCardBlock: FC<InfoCardBlockProps> = ({ rows }) => {
  return (
    <View style={styles.card}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          <Typography variant="bodySmall" color="grey.dark">
            {row.label}
          </Typography>
          <Typography
            variant="bodySmall"
            color={row.tone === 'success' ? 'success.color' : 'grey.extraDark'}
            style={styles.rowValue}
          >
            {row.value}
          </Typography>
        </View>
      ))}
    </View>
  );
};

interface TransactionsCardBlockProps {
  title: string;
  items: TransactionItem[];
}

const TransactionsCardBlock: FC<TransactionsCardBlockProps> = ({ title, items }) => {
  return (
    <View style={styles.txCard}>
      <View style={styles.txHeader}>
        <Typography variant="caption" style={styles.txHeaderTitle}>
          {title}
        </Typography>
        <Pressable accessibilityRole="button" hitSlop={10} style={styles.chevronChip}>
          <Image source={CHEVRON} style={styles.chevron} resizeMode="contain" />
        </Pressable>
      </View>
      <View style={{ gap: spacing.xl }}>
        {items.map((tx, i) => (
          <View key={i} style={styles.tx}>
            <View style={styles.txAvatar}>
              <Typography variant="captionBig" color="tertiary.color">
                {tx.initial ?? tx.name.slice(0, 1).toUpperCase()}
              </Typography>
            </View>
            <View style={styles.txMid}>
              <Typography variant="captionBig">{tx.name}</Typography>
              <Typography variant="captionRegular" style={styles.txSubtitle}>
                {tx.subtitle}
              </Typography>
            </View>
            <Typography
              variant="bodySmall"
              color={tx.positive ? 'success.color' : 'grey.extraDark'}
              style={styles.txAmount}
            >
              {tx.amount}
            </Typography>
          </View>
        ))}
      </View>
    </View>
  );
};

function getTextStyles(
  variant: 'h1' | 'h2' | 'body' | 'caption' | undefined,
): { variant: TypographyVariant; color: TypographyColor } {
  switch (variant) {
    case 'h1':
      return { variant: 'h1', color: 'tertiary.color' };
    case 'h2':
      return { variant: 'h2', color: 'tertiary.color' };
    case 'caption':
      return { variant: 'caption', color: 'grey.dark' };
    case 'body':
    default:
      return { variant: 'body', color: 'grey.extraDark' };
  }
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xl },
  profile: { alignItems: 'center', gap: spacing.base },
  profileImage: { width: 48, height: 48 },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.tertiary.color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white.color,
    borderRadius: radii.card,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl,
    gap: spacing.base,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowValue: { textAlign: 'right' },
  txCard: {
    backgroundColor: colors.white.color,
    borderRadius: radii.input,
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.base,
    gap: spacing.base,
  },
  txHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  txHeaderTitle: { opacity: 0.75 },
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
  tx: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  txAvatar: {
    width: 36,
    height: 36,
    borderRadius: radii.avatar,
    backgroundColor: colors.white.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txMid: { flex: 1, gap: 4 },
  txSubtitle: { opacity: 0.5 },
  txAmount: { textAlign: 'right', width: 90 },
  divider: { height: 1, backgroundColor: colors.tertiary.light },
  buttonWrap: { alignSelf: 'stretch' },
  unknown: {
    padding: spacing.md,
    backgroundColor: colors.error.light,
    borderRadius: radii.input,
  },
});
