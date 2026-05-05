import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
  FlatList,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getUserProfile, getUserProgress, UserProfile, UserProgress, addXP } from "@/lib/store";
import { REAL_LIFE_SCENARIOS, RealLifeScenario } from "@/lib/content";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const MOCK_PARTNERS = [
  { id: "1", name: "Maria S.", country: "🇧🇷", language: "Inglês", level: "Intermediário", rating: 4.8 },
  { id: "2", name: "Carlos M.", country: "🇲🇽", language: "Inglês", level: "Iniciante", rating: 4.5 },
  { id: "3", name: "Ana L.", country: "🇵🇹", language: "Espanhol", level: "Avançado", rating: 4.9 },
  { id: "4", name: "João P.", country: "🇧🇷", language: "Francês", level: "Iniciante", rating: 4.3 },
  { id: "5", name: "Sofia R.", country: "🇦🇷", language: "Inglês", level: "Intermediário", rating: 4.7 },
  { id: "6", name: "Pedro A.", country: "🇧🇷", language: "Inglês", level: "Avançado", rating: 5.0 },
];

type Tab = "connect" | "reallife";

export default function ConnectScreen() {
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<Tab>("connect");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [searching, setSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [partner, setPartner] = useState<typeof MOCK_PARTNERS[0] | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState("Inglês");
  const [selectedLevel, setSelectedLevel] = useState("Todos");
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      getUserProfile().then(setProfile);
      getUserProgress().then(setProgress);
    }, [])
  );

  useEffect(() => {
    if (searching) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      pulse.start();
      searchTimer.current = setTimeout(() => {
        pulse.stop();
        pulseAnim.setValue(1);
        const available = MOCK_PARTNERS.filter(
          (p) =>
            (selectedLanguage === "Todos" || p.language === selectedLanguage) &&
            (selectedLevel === "Todos" || p.level === selectedLevel)
        );
        const found = available[Math.floor(Math.random() * available.length)] || MOCK_PARTNERS[0];
        setPartner(found);
        setMatchFound(true);
        setSearching(false);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }, 3000);
      return () => {
        pulse.stop();
        if (searchTimer.current) clearTimeout(searchTimer.current);
      };
    }
  }, [searching]);

  const handleStartSearch = () => {
    setMatchFound(false);
    setPartner(null);
    setSearching(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleCancelSearch = () => {
    setSearching(false);
    if (searchTimer.current) clearTimeout(searchTimer.current);
  };

  const handleJoinCall = async () => {
    if (!partner) return;
    const roomId = `lingua-${selectedLanguage.toLowerCase()}-${Date.now()}`;
    await addXP(10);
    router.push({ pathname: "/jitsi/[roomId]" as any, params: { roomId, partnerName: partner.name } });
    setMatchFound(false);
    setPartner(null);
  };

  const LANGUAGES = ["Inglês", "Espanhol", "Francês"];
  const LEVELS = ["Todos", "Iniciante", "Intermediário", "Avançado"];

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={[styles.header, { backgroundColor: "#4169E1" }]}>
        <Text style={styles.headerTitle}>Conversar & Praticar</Text>
        <Text style={styles.headerSub}>Conecte-se com estudantes do mundo</Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.tab, activeTab === "connect" && styles.activeTab]}
          onPress={() => setActiveTab("connect")}
        >
          <Text style={[styles.tabText, { color: activeTab === "connect" ? "#4169E1" : colors.muted }]}>
            🎥 Conversa ao Vivo
          </Text>
          {activeTab === "connect" && <View style={styles.tabIndicator} />}
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "reallife" && styles.activeTab]}
          onPress={() => setActiveTab("reallife")}
        >
          <Text style={[styles.tabText, { color: activeTab === "reallife" ? "#4169E1" : colors.muted }]}>
            🌆 Vida Real
          </Text>
          {activeTab === "reallife" && <View style={styles.tabIndicator} />}
        </Pressable>
      </View>

      {activeTab === "connect" ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Match Found Modal */}
          {matchFound && partner && (
            <View style={[styles.matchCard, { backgroundColor: "#4169E1" }]}>
              <Text style={styles.matchEmoji}>🎉</Text>
              <Text style={styles.matchTitle}>Parceiro encontrado!</Text>
              <View style={[styles.partnerCard, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={{ fontSize: 36 }}>👤</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.partnerName}>{partner.country} {partner.name}</Text>
                  <Text style={styles.partnerMeta}>{partner.language} · {partner.level}</Text>
                  <Text style={styles.partnerRating}>⭐ {partner.rating}</Text>
                </View>
              </View>
              <View style={styles.matchActions}>
                <Pressable
                  style={[styles.matchBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]}
                  onPress={() => { setMatchFound(false); setPartner(null); }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>Recusar</Text>
                </Pressable>
                <Pressable
                  style={[styles.matchBtn, { backgroundColor: "#fff", flex: 1.5 }]}
                  onPress={handleJoinCall}
                >
                  <Text style={{ color: "#4169E1", fontWeight: "700", fontSize: 15 }}>🎥 Entrar na Chamada</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Search section */}
          <View style={styles.searchSection}>
            {/* Language filter */}
            <Text style={[styles.filterLabel, { color: colors.muted }]}>Idioma</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang}
                  style={[
                    styles.chip,
                    { backgroundColor: selectedLanguage === lang ? "#4169E1" : colors.surface, borderColor: selectedLanguage === lang ? "#4169E1" : colors.border },
                  ]}
                  onPress={() => setSelectedLanguage(lang)}
                >
                  <Text style={[styles.chipText, { color: selectedLanguage === lang ? "#fff" : colors.muted }]}>{lang}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Level filter */}
            <Text style={[styles.filterLabel, { color: colors.muted }]}>Nível</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
              {LEVELS.map((lvl) => (
                <Pressable
                  key={lvl}
                  style={[
                    styles.chip,
                    { backgroundColor: selectedLevel === lvl ? "#7C3AED" : colors.surface, borderColor: selectedLevel === lvl ? "#7C3AED" : colors.border },
                  ]}
                  onPress={() => setSelectedLevel(lvl)}
                >
                  <Text style={[styles.chipText, { color: selectedLevel === lvl ? "#fff" : colors.muted }]}>{lvl}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Search button */}
            <View style={styles.searchCenter}>
              {searching ? (
                <>
                  <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }], borderColor: "#4169E1" }]} />
                  <View style={[styles.searchCircle, { backgroundColor: "#4169E1" }]}>
                    <Text style={{ fontSize: 40 }}>🔍</Text>
                    <Text style={styles.searchingText}>Buscando...</Text>
                  </View>
                  <Pressable style={[styles.cancelBtn, { borderColor: colors.border }]} onPress={handleCancelSearch}>
                    <Text style={[styles.cancelBtnText, { color: colors.muted }]}>Cancelar</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  style={[styles.findBtn, { backgroundColor: "#4169E1" }]}
                  onPress={handleStartSearch}
                >
                  <Text style={styles.findBtnEmoji}>🎯</Text>
                  <Text style={styles.findBtnText}>Encontrar Parceiro</Text>
                  <Text style={styles.findBtnSub}>Conversação aleatória em {selectedLanguage}</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Stats */}
          <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.statsTitle, { color: colors.foreground }]}>Suas Conversas</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#4169E1" }]}>{progress?.conversationSessions || 0}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Sessões</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#7C3AED" }]}>{progress?.totalMinutes || 0}</Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Minutos</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#059669" }]}>
                  {progress?.conversationSessions ? "4.7" : "--"}
                </Text>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Avaliação</Text>
              </View>
            </View>
          </View>

          {/* Online partners preview */}
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Estudantes Online</Text>
          {MOCK_PARTNERS.slice(0, 4).map((p) => (
            <View key={p.id} style={[styles.onlinePartner, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.onlineAvatar, { backgroundColor: "#4169E120" }]}>
                <Text style={{ fontSize: 22 }}>👤</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.partnerNameSmall, { color: colors.foreground }]}>{p.country} {p.name}</Text>
                <Text style={[styles.partnerMetaSmall, { color: colors.muted }]}>{p.language} · {p.level}</Text>
              </View>
              <View style={styles.onlineDot} />
            </View>
          ))}
        </ScrollView>
      ) : (
        // Real Life Tab
        <RealLifeTab colors={colors} />
      )}
    </ScreenContainer>
  );
}

function RealLifeTab({ colors }: { colors: any }) {
  const [langFilter, setLangFilter] = useState("Inglês");
  const scenarios = REAL_LIFE_SCENARIOS.filter((s) => s.language === langFilter);

  return (
    <FlatList
      data={scenarios}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.scenarioGrid}
      columnWrapperStyle={{ gap: 12 }}
      ListHeaderComponent={
        <View style={styles.realLifeHeader}>
          <Text style={[styles.realLifeTitle, { color: colors.foreground }]}>Simulações da Vida Real</Text>
          <Text style={[styles.realLifeSub, { color: colors.muted }]}>Pratique em situações do cotidiano</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {["Inglês", "Espanhol", "Francês"].map((lang) => (
              <Pressable
                key={lang}
                style={[
                  styles.chip,
                  { backgroundColor: langFilter === lang ? "#059669" : colors.surface, borderColor: langFilter === lang ? "#059669" : colors.border, marginRight: 8 },
                ]}
                onPress={() => setLangFilter(lang)}
              >
                <Text style={[styles.chipText, { color: langFilter === lang ? "#fff" : colors.muted }]}>{lang}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.scenarioCard,
            { backgroundColor: item.color + "15", borderColor: item.color + "40", opacity: pressed ? 0.85 : 1 },
          ]}
          onPress={() => router.push({ pathname: "/scenario/[id]" as any, params: { id: item.id } })}
        >
          <Text style={styles.scenarioEmoji}>{item.emoji}</Text>
          <Text style={[styles.scenarioTitle, { color: colors.foreground }]}>{item.title}</Text>
          <Text style={[styles.scenarioDesc, { color: colors.muted }]} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={[styles.scenarioLevel, { backgroundColor: item.color + "20" }]}>
            <Text style={[styles.scenarioLevelText, { color: item.color }]}>
              {item.level === "beginner" ? "Iniciante" : item.level === "intermediate" ? "Intermediário" : "Avançado"}
            </Text>
          </View>
        </Pressable>
      )}
      ListEmptyComponent={
        <View style={{ alignItems: "center", padding: 40 }}>
          <Text style={{ fontSize: 48 }}>🌍</Text>
          <Text style={[{ color: colors.muted, marginTop: 12, fontSize: 15 }]}>
            Nenhum cenário disponível para {langFilter}
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  activeTab: {},
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: "#4169E1",
    borderRadius: 1,
  },
  matchCard: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  matchEmoji: {
    fontSize: 40,
  },
  matchTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
  partnerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 12,
    width: "100%",
  },
  partnerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  partnerMeta: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  partnerRating: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  matchActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  matchBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  searchSection: {
    padding: 16,
    gap: 8,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  filterRow: {
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  searchCenter: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 16,
  },
  pulseRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    opacity: 0.4,
  },
  searchCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  searchingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  findBtn: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 4,
  },
  findBtnEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  findBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
  findBtnSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  statsCard: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  onlinePartner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  onlineAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  partnerNameSmall: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  partnerMetaSmall: {
    fontSize: 12,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10B981",
  },
  // Real life
  realLifeHeader: {
    padding: 16,
    paddingBottom: 8,
  },
  realLifeTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  realLifeSub: {
    fontSize: 14,
  },
  scenarioGrid: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
    gap: 12,
  },
  scenarioCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    gap: 8,
    minHeight: 160,
    justifyContent: "space-between",
  },
  scenarioEmoji: {
    fontSize: 36,
  },
  scenarioTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  scenarioDesc: {
    fontSize: 12,
    lineHeight: 18,
  },
  scenarioLevel: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  scenarioLevelText: {
    fontSize: 11,
    fontWeight: "700",
  },
});
