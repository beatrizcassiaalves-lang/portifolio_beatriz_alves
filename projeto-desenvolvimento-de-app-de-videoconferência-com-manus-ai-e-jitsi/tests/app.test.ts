import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AsyncStorage
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock expo-haptics
vi.mock("expo-haptics", () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Warning: "warning", Error: "error" },
}));

describe("Content Data Integrity", () => {
  it("should have learning paths with required fields", async () => {
    const { LEARNING_PATHS } = await import("../lib/content");
    expect(LEARNING_PATHS.length).toBeGreaterThan(0);
    for (const path of LEARNING_PATHS) {
      expect(path.id).toBeTruthy();
      expect(path.title).toBeTruthy();
      expect(path.language).toBeTruthy();
      expect(path.modules).toBeDefined();
      expect(Array.isArray(path.modules)).toBe(true);
    }
  });

  it("should have modules with lessons", async () => {
    const { LEARNING_PATHS } = await import("../lib/content");
    for (const path of LEARNING_PATHS) {
      for (const module of path.modules) {
        expect(module.id).toBeTruthy();
        expect(module.lessons.length).toBeGreaterThan(0);
        for (const lesson of module.lessons) {
          expect(lesson.id).toBeTruthy();
          expect(["video", "exercise", "live"]).toContain(lesson.type);
          expect(lesson.duration).toBeGreaterThan(0);
          expect(lesson.xp).toBeGreaterThan(0);
        }
      }
    }
  });

  it("should have exercise lessons with valid exercises", async () => {
    const { LEARNING_PATHS } = await import("../lib/content");
    for (const path of LEARNING_PATHS) {
      for (const module of path.modules) {
        for (const lesson of module.lessons) {
          if (lesson.type === "exercise") {
            expect(lesson.exercises).toBeDefined();
            expect(lesson.exercises!.length).toBeGreaterThan(0);
            for (const ex of lesson.exercises!) {
              expect(ex.id).toBeTruthy();
              expect(ex.question).toBeTruthy();
              expect(ex.answer).toBeTruthy();
              expect(ex.options).toBeDefined();
              expect(ex.options!.includes(ex.answer)).toBe(true);
            }
          }
        }
      }
    }
  });

  it("should have real life scenarios with dialogues", async () => {
    const { REAL_LIFE_SCENARIOS } = await import("../lib/content");
    expect(REAL_LIFE_SCENARIOS.length).toBeGreaterThan(0);
    for (const scenario of REAL_LIFE_SCENARIOS) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.dialogues.length).toBeGreaterThan(0);
      for (const turn of scenario.dialogues) {
        expect(turn.id).toBeTruthy();
        expect(["user", "character"]).toContain(turn.speaker);
        if (turn.speaker === "user" && turn.options) {
          expect(turn.options.length).toBeGreaterThan(0);
          expect(turn.correctOption).toBeDefined();
          expect(turn.correctOption).toBeGreaterThanOrEqual(0);
          expect(turn.correctOption).toBeLessThan(turn.options.length);
        }
      }
    }
  });

  it("should have pronunciation phrases with required fields", async () => {
    const { PRONUNCIATION_PHRASES } = await import("../lib/content");
    expect(PRONUNCIATION_PHRASES.length).toBeGreaterThan(0);
    for (const phrase of PRONUNCIATION_PHRASES) {
      expect(phrase.id).toBeTruthy();
      expect(phrase.text).toBeTruthy();
      expect(phrase.translation).toBeTruthy();
      expect(phrase.phonetic).toBeTruthy();
      expect(["easy", "medium", "hard"]).toContain(phrase.difficulty);
      expect(phrase.language).toBeTruthy();
    }
  });
});

describe("Store Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return default profile when no data stored", async () => {
    const { getUserProfile } = await import("../lib/store");
    const profile = await getUserProfile();
    expect(profile).toBeDefined();
    expect(profile.name).toBeTruthy();
    expect(profile.learningLanguages).toBeDefined();
    expect(Array.isArray(profile.learningLanguages)).toBe(true);
  });

  it("should return default progress when no data stored", async () => {
    const { getUserProgress } = await import("../lib/store");
    const progress = await getUserProgress();
    expect(progress).toBeDefined();
    expect(progress.xp).toBeGreaterThanOrEqual(0);
    expect(progress.streak).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(progress.completedLessons)).toBe(true);
    expect(Array.isArray(progress.weeklyXP)).toBe(true);
    expect(progress.weeklyXP.length).toBe(7);
  });

  it("should return default settings when no data stored", async () => {
    const { getAppSettings } = await import("../lib/store");
    const settings = await getAppSettings();
    expect(settings).toBeDefined();
    expect(settings.dailyGoalMinutes).toBeGreaterThan(0);
    expect(typeof settings.notifications).toBe("boolean");
    expect(typeof settings.soundEffects).toBe("boolean");
  });

  it("should save and retrieve user profile", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const mockProfile = {
      name: "Test User",
      nativeLanguage: "Português",
      learningLanguages: ["Inglês"],
      level: "beginner" as const,
      avatar: "👤",
    };
    (AsyncStorage.getItem as any).mockResolvedValueOnce(JSON.stringify(mockProfile));

    const { getUserProfile } = await import("../lib/store");
    const profile = await getUserProfile();
    expect(profile.name).toBe("Test User");
  });

  it("should correctly identify completed lessons", async () => {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    const mockProgress = {
      xp: 50,
      streak: 3,
      lastStudyDate: new Date().toDateString(),
      completedLessons: ["en-beg-m1-l1", "en-beg-m1-l2"],
      completedModules: [],
      completedPaths: [],
      weeklyXP: [10, 20, 0, 0, 0, 0, 0],
      totalMinutes: 15,
      conversationSessions: 0,
      pronunciationScore: 0,
    };
    (AsyncStorage.getItem as any).mockResolvedValueOnce(JSON.stringify(mockProgress));

    const { getUserProgress } = await import("../lib/store");
    const progress = await getUserProgress();
    expect(progress.completedLessons).toContain("en-beg-m1-l1");
    expect(progress.xp).toBe(50);
    expect(progress.streak).toBe(3);
  });
});

describe("Navigation Routes", () => {
  it("should have all required learning path IDs", async () => {
    const { LEARNING_PATHS } = await import("../lib/content");
    const ids = LEARNING_PATHS.map((p) => p.id);
    expect(ids).toContain("en-beginner");
    expect(ids).toContain("es-beginner");
    expect(ids).toContain("fr-beginner");
    expect(ids).toContain("en-intermediate");
  });

  it("should have all required scenario IDs", async () => {
    const { REAL_LIFE_SCENARIOS } = await import("../lib/content");
    const ids = REAL_LIFE_SCENARIOS.map((s) => s.id);
    expect(ids).toContain("restaurant-en");
    expect(ids).toContain("airport-en");
    expect(ids).toContain("shopping-en");
  });

  it("should have unique IDs across all content", async () => {
    const { LEARNING_PATHS, REAL_LIFE_SCENARIOS, PRONUNCIATION_PHRASES } = await import("../lib/content");
    const allLessonIds: string[] = [];
    for (const path of LEARNING_PATHS) {
      for (const module of path.modules) {
        for (const lesson of module.lessons) {
          allLessonIds.push(lesson.id);
        }
      }
    }
    const uniqueIds = new Set(allLessonIds);
    expect(uniqueIds.size).toBe(allLessonIds.length);

    const scenarioIds = REAL_LIFE_SCENARIOS.map((s) => s.id);
    const uniqueScenarioIds = new Set(scenarioIds);
    expect(uniqueScenarioIds.size).toBe(scenarioIds.length);
  });
});
