// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "book.fill": "menu-book",
  "message.fill": "chat",
  "person.fill": "person",
  // General
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "xmark": "close",
  "checkmark": "check",
  "star.fill": "star",
  "star": "star-border",
  "flame.fill": "local-fire-department",
  "trophy.fill": "emoji-events",
  "bolt.fill": "bolt",
  "mic.fill": "mic",
  "mic": "mic-none",
  "waveform": "graphic-eq",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",
  "video.fill": "videocam",
  "globe": "language",
  "person.2.fill": "group",
  "clock.fill": "access-time",
  "lock.fill": "lock",
  "lock.open.fill": "lock-open",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "gear": "settings",
  "bell.fill": "notifications",
  "magnifyingglass": "search",
  "plus": "add",
  "minus": "remove",
  "info.circle": "info",
  "exclamationmark.circle": "error",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "heart.fill": "favorite",
  "heart": "favorite-border",
  "map.fill": "map",
  "cart.fill": "shopping-cart",
  "airplane": "flight",
  "fork.knife": "restaurant",
  "cross.fill": "local-hospital",
  "briefcase.fill": "work",
  "house.circle.fill": "home",
  "repeat": "repeat",
  "shuffle": "shuffle",
  "speaker.wave.2.fill": "volume-up",
  "headphones": "headphones",
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
  "pencil": "edit",
  "trash.fill": "delete",
  "square.and.arrow.up": "share",
  "arrow.clockwise": "refresh",
  "wifi": "wifi",
  "battery.100": "battery-full",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
