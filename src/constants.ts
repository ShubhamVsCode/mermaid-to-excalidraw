export const DEFAULT_FONT_SIZE = 20;
export const DEFAULT_FONT_FAMILY = 6;

export const SVG_TO_SHAPE_MAPPER: { [key: string]: "rectangle" | "ellipse" } = {
  rect: "rectangle",
  circle: "ellipse",
};

export const MERMAID_CONFIG = {
  startOnLoad: false,
  flowchart: { curve: "linear" },
  themeVariables: {
    fontSize: `${DEFAULT_FONT_SIZE * 1.25}px`,
  },
};

export const DEFAULT_BACKGROUND_COLOR = "#F6F5FF";
export const DEFAULT_STROKE_COLOR = "#867EEB";
export const DEFAULT_BLACK_COLOR = "#6B7280";
export const DEFAULT_WHITE_COLOR = "#FAFAFA";

export const COLORS = {
  BLACK: DEFAULT_BLACK_COLOR,
  WHITE: DEFAULT_WHITE_COLOR,
  BACKGROUND: DEFAULT_BACKGROUND_COLOR,
  STROKE: DEFAULT_STROKE_COLOR,
};
