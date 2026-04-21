import { FC, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import { usePagerView } from 'react-native-pager-view';
import type { StaticScreenProps } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { OnboardingIllustration } from '../components/OnboardingIllustration';
import { PagerDots } from '../components/PagerDots';
import { Screen } from '../components/Screen';
import { Typography } from '../components/Typography';
import { useOnboarding } from '../providers/Onboarding';
export interface OnboardingScreenProps extends StaticScreenProps<undefined> { }

interface Slide {
  title: string;
  body: string;
}

const slides: Slide[] = [
  {
    title: 'You ought to know where your money goes',
    body: 'Get an overview of how you are performing and motivate yourself to achieve even more.',
  },
  {
    title: 'Track every transaction without the hassle',
    body: 'Every transfer and payment lands in one place, tagged and searchable.',
  },
  {
    title: 'Set budgets that actually stick',
    body: 'Quietly nudge yourself when a category is about to go over — no shame, just signals.',
  },
  {
    title: 'Ready whenever you are',
    body: 'Sign up in seconds and your account snapshot follows you everywhere.',
  },
];

const SWIPE_DISTANCE = 40;

export const OnboardingScreen: FC<OnboardingScreenProps> = () => {
  const {
    ref: pagerRef,
    activePage,
    setPage,
    AnimatedPagerView,
    onPageSelected,
  } = usePagerView({ pagesAmount: slides.length });

  const [textHeight, setTextHeight] = useState<number | undefined>(undefined);
  const indexRef = useRef(0);
  indexRef.current = activePage;
  const { setOnboardingFinished } = useOnboarding();
  const navigation = useNavigation();

  const isLast = activePage === slides.length - 1;

  const finish = async () => {
    await setOnboardingFinished();

    navigation.navigate('OnboardingSignUp');
  };

  const next = () => {
    isLast ? finish() : setPage(activePage + 1);
  };

  const onMeasured = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    setTextHeight((prev) => (prev == null || h > prev ? h : prev));
  };

  const panHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 10,
        onPanResponderRelease: (_, g) => {
          if (Math.abs(g.dx) < SWIPE_DISTANCE) return;
          const i = indexRef.current;
          if (g.dx < 0 && i < slides.length - 1) setPage(i + 1);
          else if (g.dx > 0 && i > 0) setPage(i - 1);
        },
      }).panHandlers,
    [setPage],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <Button
          variant="secondary"
          label="Skip"
          onPress={finish}
          fullWidth={false}
        />
      </View>

      <AnimatedPagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {slides.map((_, i) => (
          <View key={i} style={styles.page}>
            <OnboardingIllustration />
          </View>
        ))}
      </AnimatedPagerView>

      <Card variant="hero" style={styles.card} {...panHandlers}>
        <View style={[styles.textBlock, { minHeight: textHeight }]}>
          <Typography variant="h2" color="tertiary.color" style={styles.center}>
            {slides[activePage].title}
          </Typography>
          <Typography variant="bodySmall" color="grey.dark" style={[styles.center, styles.body]}>
            {slides[activePage].body}
          </Typography>
        </View>

        <PagerDots count={slides.length} index={activePage} />
        <Button label={isLast ? 'Get Started' : 'Next'} onPress={next} />
      </Card>

      <View pointerEvents="none" style={styles.measureLayer} aria-hidden>
        {slides.map((slide, i) => (
          <View key={i} style={styles.measureSlide} onLayout={onMeasured}>
            <Typography variant="h2" color="tertiary.color" style={styles.center}>
              {slide.title}
            </Typography>
            <Typography variant="bodySmall" color="grey.dark" style={[styles.center, styles.body]}>
              {slide.body}
            </Typography>
          </View>
        ))}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pager: { flex: 1 },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 24,
  },
  textBlock: { alignItems: 'center' },
  center: { textAlign: 'center' },
  body: { marginTop: 16 },
  measureLayer: {
    position: 'absolute',
    top: 0,
    left: 44,
    right: 44,
    opacity: 0,
  },
  measureSlide: { alignItems: 'center' },
});
