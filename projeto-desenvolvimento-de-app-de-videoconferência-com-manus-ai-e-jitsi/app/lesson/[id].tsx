import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { LEARNING_PATHS, Module, Lesson } from "@/lib/content";
import { getUserProgress, UserProgress, completeLesson } from "@/lib/store";
import { VideoView, useVideoPlayer } from "expo-video";

const { width } = Dimensions.get("window");

const LESSON_TYPE_ICONS: Record<string, string> = {
  video: "🎬",
  exercise: "✏️",
  live: "🎥",
};

const LESSON_TYPE_LABELS: Record<string, string> = {
  video: "Vídeo-aula",
  exercise: "Exercício",
  live: "Aula ao Vivo",
};

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [playingLesson, setPlayingLesson] = useState<Lesson | null>(null);

  const path = LEARNING_PATHS.find((p) => p.id === id);

  useFocusEffect(
    useCallback(() => {
      getUserProgress().then((p) => {
        setProgress(p);
        // Auto-expand first module
        if (path && path.modules.length > 0 && !expandedModule) {
          setExpandedModule(path.modules[0].id);
        }
      });
    }, [id])
  );

  if (!path) {
    return (
      <ScreenContainer>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.muted, fontSize: 16 }}>Trilha não encontrada</Text>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{ color: "#4169E1", fontWeight: "600" }}>Voltar</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const isLessonCompleted = (lessonId: string) =>
    progress?.completedLessons.includes(lessonId) || false;

  const isModuleLocked = (moduleIndex: number) => {
    if (moduleIndex === 0) return false;
    const prevModule = path.modules[moduleIndex - 1];
    return !prevModule.lessons.every((l) => isLessonCompleted(l.id));
  };

  const handleLessonPress = async (lesson: Lesson, moduleLocked: boolean) => {
    if (moduleLocked) return;
    if (lesson.type === "live") {
      const roomId = `lingua-${path.id}-${Date.now()}`;
      router.push({ pathname: "/jitsi/[roomId]" as any, params: { roomId } });
      return;
    }
    if (lesson.type === "exercise" && lesson.exercises) {
      router.push({ pathname: "/exercise/[id]" as any, params: { id: lesson.id } });
      return;
    }
    if (lesson.type === "video") {
      setPlayingLesson(lesson);
      return;
    }
  };

  const handleMarkComplete = async (lessonId: string) => {
    const updated = await completeLesson(lessonId, 20);
    setProgress(updated);
    setPlayingLesson(null);
  };

  const totalLessons = path.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = progress
    ? path.modules.reduce(
        (acc, m) => acc + m.lessons.filter((l) => isLessonCompleted(l.id)).length,
        0
      )
    : 0;
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Video Player Modal */}
      {playingLesson && (
        <View style={styles.videoOverlay}>
          <View style={[styles.videoModal, { backgroundColor: colors.surface }]}>
            <View style={styles.videoContainer}>
              <View style={styles.videoPlaceholder}>
                <Text style={{ fontSize: 48 }}>🎬</Text>
                <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 8 }}>
                  {playingLesson.title}
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>
                  Duração: {playingLesson.duration} min
                </Text>
              </View>
            </View>
            <View style={styles.videoActions}>
              <Pressable
                style={[styles.videoBtn, { borderColor: colors.border }]}
                onPress={() => setPlayingLesson(null)}
              >
                <Text style={[styles.videoBtnText, { color: colors.muted }]}>Fechar</Text>
              </Pressable>
              <Pressable
                style={[styles.videoBtn, { backgroundColor: "#4169E1", borderColor: "#4169E1" }]}
                onPress={() => handleMarkComplete(playingLesson.id)}
              >
                <Text style={[styles.videoBtnText, { color: "#fff" }]}>✓ Concluir Lição (+20 XP)</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: path.color }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.headerEmoji}>{path.emoji}</Text>
          <Text style={styles.headerTitle}>{path.title}</Text>
          <Text style={styles.headerDesc}>{path.description}</Text>
          <View style={styles.headerStats}>
            <Text style={styles.headerStat}>📚 {path.totalModules} módulos</Text>
            <Text style={styles.headerStat}>⏱ {path.estimatedHours}h</Text>
            <Text style={styles.headerStat}>🌐 {path.language}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={[styles.progressCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.progressRow}>
            <Text style={[styles.progressLabel, { color: colors.foreground }]}>
              {completedCount} de {totalLessons} lições concluídas
            </Text>
            <Text style={[styles.progressPct, { color: "#4169E1" }]}>{pct}%</Text>
          </View>
          <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: path.color, width: `${pct}%` }]} />
          </View>
        </View>

        {/* Modules */}
        <View style={styles.modulesSection}>
          {path.modules.map((module, mIdx) => {
            const locked = isModuleLocked(mIdx);
            const isExpanded = expandedModule === module.id;
            const moduleCompleted = module.lessons.every((l) => isLessonCompleted(l.id));

            return (
              <View key={module.id} style={[styles.moduleCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Pressable
                  style={[styles.moduleHeader, { opacity: locked ? 0.5 : 1 }]}
                  onPress={() => !locked && setExpandedModule(isExpanded ? null : module.id)}
                >
                  <View style={[styles.moduleIconBg, { backgroundColor: path.color + "20" }]}>
                    <Text style={{ fontSize: 24 }}>{locked ? "🔒" : module.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.moduleTitle, { color: colors.foreground }]}>{module.title}</Text>
                    <Text style={[styles.moduleMeta, { color: colors.muted }]}>
                      {module.lessons.length} lições
                      {moduleCompleted ? " · ✓ Concluído" : ""}
                    </Text>
                  </View>
                  <Text style={[styles.chevron, { color: colors.muted }]}>
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                </Pressable>

                {isExpanded && !locked && (
                  <View style={[styles.lessonsList, { borderTopColor: colors.border }]}>
                    {module.lessons.map((lesson, lIdx) => {
                      const completed = isLessonCompleted(lesson.id);
                      return (
                        <Pressable
                          key={lesson.id}
                          style={({ pressed }) => [
                            styles.lessonItem,
                            {
                              backgroundColor: completed ? "#4169E110" : "transparent",
                              borderBottomColor: colors.border,
                              opacity: pressed ? 0.7 : 1,
                            },
                            lIdx === module.lessons.length - 1 && { borderBottomWidth: 0 },
                          ]}
                          onPress={() => handleLessonPress(lesson, locked)}
                        >
                          <View style={[styles.lessonIcon, { backgroundColor: completed ? "#4169E120" : colors.border + "50" }]}>
                            <Text style={{ fontSize: 18 }}>
                              {completed ? "✅" : LESSON_TYPE_ICONS[lesson.type]}
                            </Text>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.lessonTitle, { color: completed ? "#4169E1" : colors.foreground }]}>
                              {lesson.title}
                            </Text>
                            <Text style={[styles.lessonMeta, { color: colors.muted }]}>
                              {LESSON_TYPE_LABELS[lesson.type]} · {lesson.duration} min · +{lesson.xp} XP
                            </Text>
                          </View>
                          <Text style={{ color: colors.muted, fontSize: 18 }}>›</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 12,
  },
  backArrow: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  headerDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 20,
    marginBottom: 12,
  },
  headerStats: {
    flexDirection: "row",
    gap: 16,
  },
  headerStat: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  progressCard: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressPct: {
    fontSize: 18,
    fontWeight: "800",
  },
  progressBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  modulesSection: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  moduleCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  moduleIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  moduleMeta: {
    fontSize: 12,
  },
  chevron: {
    fontSize: 14,
  },
  lessonsList: {
    borderTopWidth: 1,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  lessonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  lessonMeta: {
    fontSize: 12,
  },
  backBtn: {
    marginTop: 16,
    padding: 12,
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  videoModal: {
    borderRadius: 24,
    overflow: "hidden",
    width: "100%",
    maxWidth: 400,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  videoActions: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
  },
  videoBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  videoBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
