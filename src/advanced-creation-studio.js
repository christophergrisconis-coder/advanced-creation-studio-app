import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  Linking,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';

// ─── BRAND TOKENS ──────────────────────────────────────────────
const BRAND = {
  navy:       '#0B1120',
  navyDark:   '#070D1A',
  navyMid:    '#0D1526',
  blue:       '#1E90FF',
  blueDark:   '#1A7EE0',
  white:      '#FFFFFF',
  gray:       '#6B7280',
  textMuted:  'rgba(255,255,255,0.62)',
  textSub:    'rgba(255,255,255,0.45)',
  border:     'rgba(30,144,255,0.2)',
};

const { width: W } = Dimensions.get('window');

// Brand assets. The supplied lockup shipped as a JPEG with a flat #0E1421
// background baked in, which showed as a lighter rectangle on every surface
// it sat on. Both files below are alpha-cut versions of it, so they composite
// cleanly anywhere. LOGO_MARK is the standalone GIL> chevron for tight spots
// like the nav, where the full lockup's wordmark is too small to read.
const LOGO_LOCKUP = require('../assets/images/logo-lockup.png');
const LOCKUP_ASPECT = 1817 / 576;

const LOGO_MARK = require('../assets/images/logo-mark.png');
const MARK_ASPECT = 547 / 429;

// ─── DATA ───────────────────────────────────────────────────────
const NAV_ITEMS = ['Home', 'About', 'Services', 'Mission', 'Contact'];

const SERVICES = [
  { icon: '🏛️', title: 'Government Partnership',    body: 'Structured programs aligned with federal and state procurement requirements, compliance checklists, and built-in reporting.' },
  { icon: '📊', title: 'Evidence-Based Reentry',    body: 'Data-driven intervention frameworks targeting housing, employment, mental health, and community support.' },
  { icon: '🤝', title: 'Holistic Reintegration',    body: 'Wrap-around services across every phase of reentry — from pre-release planning through stable community integration.' },
  { icon: '📋', title: 'Compliance & Reporting',    body: 'Outcome tracking, government reporting standards, and audit-ready documentation for every program component.' },
  { icon: '🎓', title: 'Workforce Development',     body: 'Job-readiness training, credential assistance, and employer partnerships that connect participants to sustainable careers.' },
  { icon: '🧭', title: 'Case Management',           body: 'Dedicated case managers providing structured guidance, goal-setting, and ongoing support tailored to each individual.' },
];

const MESSAGES = [
  { n: '1', title: 'Trusted Government Partner',       body: 'We operate with the credibility and documentation that federal and state agencies require in a reentry services contractor.' },
  { n: '2', title: 'Evidence-Based Solutions',         body: 'Every program is built on research-validated methods with measurable outcomes. Data drives our decisions and reports our results.' },
  { n: '3', title: 'Holistic Community Reintegration', body: 'We address the whole person — housing, employment, mental health, family, and civic identity — for lasting reentry success.' },
];

const TONE_TAGS = ['Credible', 'Dignified', 'Strategic', 'Compassionate', 'Authoritative', 'Human-Centered'];

const CHECKLIST = [
  'Brand logo placement with clear space',
  'Consistent use of brand colors and contrast',
  'Typography aligned with brand guidelines',
  'Contact details included and accurate',
  'Required legal and compliance notes present',
  'Ready for digital distribution',
  'Government contract submission ready',
];

const INTEREST_OPTIONS = [
  'Federal Contract Partnership',
  'State Contract Partnership',
  'Reentry Program Services',
  'Workforce Development',
  'Compliance & Reporting',
  'Other Inquiry',
];

// ─── REUSABLE COMPONENTS ────────────────────────────────────────

function SectionLabel({ text }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLine} />
      <Text style={styles.sectionLabelText}>{text}</Text>
    </View>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function BlueText({ children }) {
  return <Text style={{ color: BRAND.blue }}>{children}</Text>;
}

function BtnPrimary({ label, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 120, useNativeDriver: true }),
    ]).start();
    onPress && onPress();
  };
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={press}>
      <Animated.View style={[styles.btnPrimary, { transform: [{ scale }] }]}>
        <Text style={styles.btnPrimaryText}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function BtnOutline({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.btnOutline} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.btnOutlineText}>{label}</Text>
    </TouchableOpacity>
  );
}

function ServiceCard({ icon, title, body }) {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.serviceCard, pressed && styles.serviceCardPressed]}
    >
      <View style={styles.serviceIcon}>
        <Text style={{ fontSize: 22 }}>{icon}</Text>
      </View>
      <Text style={styles.serviceCardTitle}>{title}</Text>
      <Text style={styles.serviceCardBody}>{body}</Text>
    </TouchableOpacity>
  );
}

function MessageItem({ n, title, body }) {
  return (
    <View style={styles.messageItem}>
      <View style={styles.messageNumber}>
        <Text style={styles.messageNumberText}>{n}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.messageItemTitle}>{title}</Text>
        <Text style={styles.messageItemBody}>{body}</Text>
      </View>
    </View>
  );
}

// ─── SECTIONS ───────────────────────────────────────────────────

function HeroSection({ scrollTo }) {
  return (
    <View style={styles.hero}>
      {/* Accent bar */}
      <View style={styles.heroAccentBar} />

      <View style={styles.heroEyebrow}>
        <View style={styles.heroEyebrowLine} />
        <Text style={styles.heroEyebrowText}>Recidivism Reduction & Reentry Support</Text>
      </View>

      <Text style={styles.heroH1}>
        Advancing <BlueText>Safer Communities</BlueText>{'\n'}Through Purposeful Reentry
      </Text>

      <Text style={styles.heroSub}>
        Advanced Creation Studio is a trusted, government-partnered organization delivering evidence-based programs that reduce recidivism and build lasting pathways for individuals returning to their communities.
      </Text>

      <View style={styles.heroActions}>
        <BtnPrimary label="LET'S PARTNER" onPress={() => scrollTo('Contact')} />
        <BtnOutline label="OUR PROGRAMS"  onPress={() => scrollTo('Services')} />
      </View>

      <View style={styles.heroStats}>
        {[
          { value: 'Federal', label: 'Government Ready' },
          { value: 'State',   label: 'Contract Eligible' },
          { value: '360°',    label: 'Holistic Support' },
          { value: 'Evidence', label: 'Based Methods' },
        ].map((s, i) => (
          <View key={i} style={styles.heroStatItem}>
            <Text style={styles.heroStatValue}>{s.value}</Text>
            <Text style={styles.heroStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MissionStrip() {
  const tags = ['Clear.', 'Consistent.', 'Confident.', 'Built to Win.'];
  return (
    <View style={styles.missionStrip}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.missionStripInner}>
        {tags.map((t, i) => (
          <React.Fragment key={i}>
            <Text style={styles.missionStripText}>{t}</Text>
            {i < tags.length - 1 && <View style={styles.missionDot} />}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

// ─── LEADERSHIP PORTRAIT ────────────────────────────────────────
// To use a real headshot, drop the file in assets/images/ and change
// PROFILE_PHOTO to:  require('../assets/images/headshot.jpg')
// Leave it null to show the branded ACS monogram placeholder instead.
const PROFILE_PHOTO = null;

// Name and title render only when filled in — left blank so nothing
// unverified goes live. Fill these in when the headshot goes up.
const PROFILE = {
  name:  '',
  title: '',
};

function ProfilePortrait() {
  return (
    <View style={styles.profileBlock}>
      {PROFILE_PHOTO ? (
        <Image source={PROFILE_PHOTO} style={styles.profilePhoto} resizeMode="cover" />
      ) : (
        <View style={styles.profileMonogram}>
          <Image source={LOGO_MARK} style={styles.profileMonogramMark} resizeMode="contain" />
        </View>
      )}

      {!!PROFILE.name && <Text style={styles.profileName}>{PROFILE.name}</Text>}
      {!!PROFILE.title && <Text style={styles.profileTitle}>{PROFILE.title}</Text>}
    </View>
  );
}

function AboutSection() {
  return (
    <View style={[styles.section, { backgroundColor: BRAND.navyMid }]}>
      <SectionLabel text="WHO WE ARE" />
      <SectionTitle>
        Premium Authority.{'\n'}<BlueText>Human-Centered</BlueText> Approach.
      </SectionTitle>

      <Text style={styles.bodyText}>
        Advanced Creation Studio is a professional services firm operating at the intersection of government compliance, community development, and human dignity.
      </Text>
      <Text style={[styles.bodyText, { marginTop: 12 }]}>
        Every program we build is rooted in evidence, shaped by compassion, and executed with the precision governments require. Successful reentry is not a single event — it is a supported journey.
      </Text>

      <ProfilePortrait />

      <View style={styles.toneBox}>
        <Text style={styles.toneBoxLabel}>OUR BRAND TONE</Text>
        <View style={styles.toneGrid}>
          {TONE_TAGS.map((tag, i) => (
            <View key={i} style={styles.toneTag}>
              <Text style={styles.toneTagText}>✦ {tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function ServicesSection() {
  return (
    <View style={styles.section}>
      <SectionLabel text="WHAT WE DO" />
      <SectionTitle>
        Programs Built to{'\n'}<BlueText>Reduce Recidivism</BlueText>
      </SectionTitle>
      <Text style={styles.sectionSubtitle}>
        Each service is designed, documented, and compliant — ready for federal and state contract submission.
      </Text>
      <View style={styles.servicesGrid}>
        {SERVICES.map((s, i) => (
          <ServiceCard key={i} {...s} />
        ))}
      </View>
    </View>
  );
}

function SloganBanner() {
  return (
    <View style={styles.sloganBanner}>
      <Text style={styles.sloganQuote}>
        "Complete. Professional.{'\n'}<BlueText>Contract-Ready.</BlueText>"
      </Text>
      <Text style={styles.sloganCite}>Advanced Creation Studio — advancedcreationstudio.com</Text>
    </View>
  );
}

function MissionSection() {
  return (
    <View style={[styles.section, { backgroundColor: BRAND.navyMid }]}>
      <SectionLabel text="OUR MISSION" />
      <SectionTitle>Key <BlueText>Messages</BlueText></SectionTitle>

      {MESSAGES.map((m, i) => <MessageItem key={i} {...m} />)}

      <View style={styles.complianceCard}>
        <Text style={styles.complianceTitle}>COMPLIANCE CHECKLIST</Text>
        {CHECKLIST.map((item, i) => (
          <View key={i} style={styles.checklistItem}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.checklistText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ContactSection() {
  const [name,     setName]     = useState('');
  const [org,      setOrg]      = useState('');
  const [email,    setEmail]    = useState('');
  const [message,  setMessage]  = useState('');
  const [interest, setInterest] = useState(0);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      setError('Please enter your name and email address.');
      return;
    }
    setError('');
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName(''); setOrg(''); setEmail(''); setMessage('');
    }, 6000);
  };

  const openWebsite = () => Linking.openURL('https://advancedcreationstudio.com');
  const openEmail   = () => Linking.openURL('mailto:info@advancedcreationstudio.com');

  return (
    <View style={styles.section}>
      <SectionLabel text="LET'S PARTNER" />
      <SectionTitle>Connect With{'\n'}<BlueText>Our Team</BlueText></SectionTitle>

      <Text style={styles.bodyText}>
        Connect with us to learn how Advanced Creation Studio can advance safer communities in your jurisdiction. We are ready for federal and state contract conversations.
      </Text>

      {/* Contact details */}
      {[
        { icon: '🌐', label: 'WEBSITE',  value: 'advancedcreationstudio.com', onPress: openWebsite },
        { icon: '📍', label: 'LOCATION', value: 'Concord, North Carolina, US' },
        { icon: '📧', label: 'EMAIL',    value: 'info@advancedcreationstudio.com', onPress: openEmail },
      ].map((d, i) => (
        <TouchableOpacity key={i} style={styles.contactDetail} onPress={d.onPress} activeOpacity={d.onPress ? 0.7 : 1}>
          <View style={styles.contactIcon}><Text style={{ fontSize: 18 }}>{d.icon}</Text></View>
          <View>
            <Text style={styles.contactLabel}>{d.label}</Text>
            <Text style={[styles.contactValue, d.onPress && { color: BRAND.blue }]}>{d.value}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Form */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Start a Conversation</Text>

        {[
          { label: 'FULL NAME',         value: name,    set: setName,    placeholder: 'Your full name' },
          { label: 'ORGANIZATION',      value: org,     set: setOrg,     placeholder: 'Agency or organization name' },
          { label: 'EMAIL ADDRESS',     value: email,   set: setEmail,   placeholder: 'your@email.gov', keyboardType: 'email-address' },
        ].map((f, i) => (
          <View key={i} style={styles.formGroup}>
            <Text style={styles.formLabel}>{f.label}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={f.placeholder}
              placeholderTextColor={BRAND.gray}
              value={f.value}
              onChangeText={f.set}
              keyboardType={f.keyboardType || 'default'}
              autoCapitalize="none"
            />
          </View>
        ))}

        {/* Interest selector */}
        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>AREA OF INTEREST</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
            {INTEREST_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.interestChip, interest === i && styles.interestChipActive]}
                onPress={() => setInterest(i)}
              >
                <Text style={[styles.interestChipText, interest === i && { color: BRAND.white }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.formLabel}>MESSAGE</Text>
          <TextInput
            style={[styles.formInput, styles.formTextarea]}
            placeholder="Tell us about your jurisdiction's needs..."
            placeholderTextColor={BRAND.gray}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {error ? <Text style={styles.formError}>{error}</Text> : null}

        {sent ? (
          <View style={styles.formSuccess}>
            <Text style={styles.formSuccessText}>✓ Inquiry received. We will respond within 2 business days.</Text>
          </View>
        ) : (
          <BtnPrimary label="SEND PARTNERSHIP INQUIRY" onPress={handleSubmit} />
        )}
      </View>
    </View>
  );
}

function FooterSection() {
  return (
    <View style={styles.footer}>
      <Image
        source={LOGO_LOCKUP}
        style={styles.footerLogo}
        resizeMode="contain"
        accessibilityLabel="Advanced Creation Studio"
      />
      <Text style={styles.footerTagline}>
        A unified brand system built for trust, clarity, and compliance. Ready for digital distribution and government contract submission.
      </Text>
      <View style={styles.footerDivider} />
      <View style={styles.footerBottom}>
        <Text style={styles.footerCopy}>© 2026 Advanced Creation Studio</Text>
        <Text style={styles.footerSlogan}>Clear. Consistent. Confident.</Text>
      </View>
    </View>
  );
}

// ─── APP ROOT ───────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  const scrollTo = (section) => {
    setActiveNav(section);
    const ref = sectionRefs.current[section];
    if (ref && scrollRef.current) {
      ref.measureLayout(
        scrollRef.current,
        (x, y) => scrollRef.current.scrollTo({ y: y - 60, animated: true }),
        () => {}
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND.navy} />

      {/* ── Sticky Nav ── */}
      <View style={styles.nav}>
        <Image
          source={LOGO_MARK}
          style={styles.navLogo}
          resizeMode="contain"
          accessibilityLabel="Advanced Creation Studio"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.navItems}>
          {NAV_ITEMS.map(item => (
            <TouchableOpacity key={item} onPress={() => scrollTo(item)} style={styles.navItem}>
              <Text style={[styles.navItemText, activeNav === item && styles.navItemActive]}>
                {item}
              </Text>
              {activeNav === item && <View style={styles.navUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Scrollable Content ── */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View ref={r => (sectionRefs.current['Home'] = r)}>
          <HeroSection scrollTo={scrollTo} />
        </View>

        <MissionStrip />

        <View ref={r => (sectionRefs.current['About'] = r)}>
          <AboutSection />
        </View>

        <View ref={r => (sectionRefs.current['Services'] = r)}>
          <ServicesSection />
        </View>

        <SloganBanner />

        <View ref={r => (sectionRefs.current['Mission'] = r)}>
          <MissionSection />
        </View>

        <View ref={r => (sectionRefs.current['Contact'] = r)}>
          <ContactSection />
        </View>

        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND.navy },

  // Nav
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(11,17,32,0.97)',
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 100,
  },
  navLogo: { width: 30 * MARK_ASPECT, height: 30, marginRight: 14 },
  navItems: { flexDirection: 'row', gap: 4 },
  navItem: { paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center' },
  navItemText: { color: BRAND.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  navItemActive: { color: BRAND.blue },
  navUnderline: { height: 2, width: '100%', backgroundColor: BRAND.blue, marginTop: 3, borderRadius: 1 },

  // Hero
  hero: {
    backgroundColor: BRAND.navy,
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.border,
  },
  heroAccentBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: BRAND.blue },
  heroEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  heroEyebrowLine: { width: 24, height: 2, backgroundColor: BRAND.blue },
  heroEyebrowText: { color: BRAND.blue, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  heroH1: { fontSize: W > 400 ? 30 : 26, fontWeight: '900', color: BRAND.white, lineHeight: 36, marginBottom: 16, letterSpacing: -0.5 },
  heroSub: { fontSize: 15, color: BRAND.textMuted, lineHeight: 24, marginBottom: 28 },
  heroActions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', marginBottom: 32 },
  heroStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, borderTopWidth: 1, borderTopColor: BRAND.border, paddingTop: 24 },
  heroStatItem: { minWidth: 80 },
  heroStatValue: { color: BRAND.blue, fontSize: 18, fontWeight: '900' },
  heroStatLabel: { color: BRAND.textSub, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 },

  // Mission Strip
  missionStrip: { backgroundColor: BRAND.blue, paddingVertical: 14 },
  missionStripInner: { alignItems: 'center', paddingHorizontal: 16, gap: 12 },
  missionStripText: { color: BRAND.white, fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },
  missionDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },

  // Shared Section
  section: { backgroundColor: BRAND.navy, paddingHorizontal: 20, paddingVertical: 48 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionLabelLine: { width: 18, height: 2, backgroundColor: BRAND.blue },
  sectionLabelText: { color: BRAND.blue, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionTitle: { fontSize: W > 400 ? 26 : 22, fontWeight: '900', color: BRAND.white, lineHeight: 32, marginBottom: 16 },
  sectionSubtitle: { fontSize: 14, color: BRAND.textMuted, lineHeight: 22, marginBottom: 24 },
  bodyText: { fontSize: 15, color: BRAND.textMuted, lineHeight: 24 },

  // About
  // Leadership portrait
  profileBlock: { marginTop: 32, alignItems: 'center' },
  profilePhoto: { width: 132, height: 132, borderRadius: 20, borderWidth: 2, borderColor: BRAND.border },
  profileMonogram: {
    width: 132,
    height: 132,
    borderRadius: 20,
    backgroundColor: BRAND.navyDark,
    borderWidth: 2,
    borderColor: BRAND.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileMonogramMark: { width: 78, height: 78 / MARK_ASPECT },
  profileName: { color: BRAND.white, fontSize: 15, fontWeight: '800', letterSpacing: 0.5, marginTop: 14 },
  profileTitle: { color: BRAND.textMuted, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 },

  toneBox: { marginTop: 28, backgroundColor: 'rgba(30,144,255,0.08)', borderWidth: 1, borderColor: BRAND.border, borderRadius: 12, padding: 20 },
  toneBoxLabel: { color: BRAND.blue, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 },
  toneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toneTag: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
  toneTagText: { color: BRAND.white, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  // Services
  servicesGrid: { marginTop: 24, gap: 16 },
  serviceCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: BRAND.border, borderRadius: 12, padding: 20, borderTopWidth: 3, borderTopColor: 'transparent' },
  serviceCardPressed: { backgroundColor: 'rgba(30,144,255,0.08)', borderColor: 'rgba(30,144,255,0.5)', borderTopColor: BRAND.blue },
  serviceIcon: { width: 44, height: 44, backgroundColor: 'rgba(30,144,255,0.12)', borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  serviceCardTitle: { color: BRAND.white, fontSize: 15, fontWeight: '700', marginBottom: 8 },
  serviceCardBody: { color: BRAND.textMuted, fontSize: 13, lineHeight: 20 },

  // Slogan Banner
  sloganBanner: { backgroundColor: '#0F1D3A', borderTopWidth: 1, borderBottomWidth: 1, borderColor: BRAND.border, paddingHorizontal: 20, paddingVertical: 48, alignItems: 'center' },
  sloganQuote: { fontSize: W > 400 ? 24 : 20, fontWeight: '900', color: BRAND.white, textAlign: 'center', lineHeight: 32, marginBottom: 12 },
  sloganCite: { color: BRAND.textSub, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', textAlign: 'center' },

  // Messages
  messageItem: { flexDirection: 'row', gap: 14, marginBottom: 24, alignItems: 'flex-start' },
  messageNumber: { width: 34, height: 34, borderRadius: 17, backgroundColor: BRAND.blue, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  messageNumberText: { color: BRAND.white, fontWeight: '900', fontSize: 13 },
  messageItemTitle: { color: BRAND.white, fontWeight: '700', fontSize: 14, marginBottom: 6 },
  messageItemBody: { color: BRAND.textMuted, fontSize: 13, lineHeight: 20 },
  complianceCard: { backgroundColor: 'rgba(30,144,255,0.07)', borderWidth: 1, borderColor: BRAND.border, borderRadius: 12, padding: 20, marginTop: 8 },
  complianceTitle: { color: BRAND.blue, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 14 },
  checklistItem: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  checkmark: { color: BRAND.blue, fontWeight: '700', fontSize: 13 },
  checklistText: { color: BRAND.textMuted, fontSize: 13, lineHeight: 20, flex: 1 },

  // Contact
  contactDetail: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 20 },
  contactIcon: { width: 40, height: 40, backgroundColor: 'rgba(30,144,255,0.12)', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  contactLabel: { color: BRAND.blue, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  contactValue: { color: BRAND.textMuted, fontSize: 14, marginTop: 2 },
  formCard: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: BRAND.border, borderRadius: 12, padding: 24, marginTop: 28 },
  formTitle: { color: BRAND.white, fontWeight: '700', fontSize: 16, marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  formLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 7 },
  formInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 12, color: BRAND.white, fontSize: 14 },
  formTextarea: { height: 110, textAlignVertical: 'top' },
  interestChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', marginRight: 8 },
  interestChipActive: { backgroundColor: BRAND.blue, borderColor: BRAND.blue },
  interestChipText: { color: BRAND.textMuted, fontSize: 12, fontWeight: '600' },
  formError: { color: '#FF6B6B', fontSize: 13, marginBottom: 12 },
  formSuccess: { backgroundColor: 'rgba(30,144,255,0.12)', borderWidth: 1, borderColor: BRAND.blue, borderRadius: 8, padding: 16, alignItems: 'center' },
  formSuccessText: { color: BRAND.blue, fontWeight: '700', fontSize: 13, textAlign: 'center' },

  // Buttons
  btnPrimary: { backgroundColor: BRAND.blue, paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8 },
  btnPrimaryText: { color: BRAND.white, fontWeight: '700', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  btnOutline: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', paddingVertical: 13, paddingHorizontal: 24, borderRadius: 8 },
  btnOutlineText: { color: BRAND.white, fontWeight: '700', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },

  // Footer
  footer: { backgroundColor: BRAND.navyDark, borderTopWidth: 1, borderTopColor: BRAND.border, paddingHorizontal: 20, paddingVertical: 40 },
  footerLogo: { width: 56 * LOCKUP_ASPECT, height: 56, marginLeft: -4 },
  footerTagline: { color: BRAND.textSub, fontSize: 13, lineHeight: 20, marginTop: 10, maxWidth: 300 },
  footerDivider: { height: 1, backgroundColor: BRAND.border, marginVertical: 24 },
  footerBottom: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 },
  footerCopy: { color: BRAND.textSub, fontSize: 11 },
  footerSlogan: { color: BRAND.textSub, fontSize: 11 },
});
