/* eslint-disable prettier/prettier */

import { GraphConverter } from "../GraphConverter.js";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform.js";
import { COLORS, DEFAULT_FONT_FAMILY } from "../../constants.js";
import { MindmapDiagram, Node } from "../../parser/mindmap.js";
import { nanoid } from "nanoid";

// Helper function to calculate the next X position
const getNextX = (x: number, spacing: number) => x + spacing;

// Helper function to calculate the next Y position
const getNextY = (
  y: number,
  index: number,
  height: number,
  spacing: number,
  childrenLength: number,
) => {
  const offset = ((childrenLength - 1) * (height + spacing)) / 2;
  return y - offset + index * (height + spacing);
};

// Function to create a rectangle element
const createRectangleElement = (
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
): ExcalidrawElementSkeleton => ({
  id,
  type: "rectangle",
  x,
  y,
  width,
  height,
  strokeColor: COLORS.STROKE,
  backgroundColor: COLORS.BACKGROUND,
  roughness: 0,
  roundness: { type: 2 },
  label: {
    text,
    fontSize: 20,
    verticalAlign: "middle",
    fontFamily: DEFAULT_FONT_FAMILY,
  },
});

// Function to create an arrow element
const createArrowElement = (
  id: string,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  startId: string,
  endId: string,
): ExcalidrawElementSkeleton => ({
  id,
  type: "arrow",
  x: startX,
  y: startY,
  points: [
    [0, 0], // Normalized start point
    [
      endX - startX - 140,
      endY -
        startY +
        // when y diff is positive, the arrow is pointing up
        // when y diff is negative, the arrow is pointing down
        // when y diff is 0, the arrow is pointing straight
        20 * -1 * (endY - startY > 0 ? 1 : endY - startY === 0 ? 0 : -1),
    ],
    [endX - startX, endY - startY], // Normalized end point
  ],
  start: { id: startId },
  end: { id: endId },
  startBinding: { elementId: startId, focus: 0.5, gap: 5 },
  endBinding: { elementId: endId, focus: 0.5, gap: 5 },
  strokeColor: COLORS.BLACK,
  roughness: 0,
  roundness: { type: 2 },
  endArrowhead: "triangle",
});

// Recursive function to create children elements
const createChildrenElements = (
  children: Node[],
  NODE_HEIGHT: number,
  NODE_WIDTH: number,
  xSpacing: number,
  ySpacing: number,
  rootElementId: string,
  rootElementX: number,
  rootElementY: number,
): ExcalidrawElementSkeleton[] => {
  const childrenLength = children.length;
  const childrenElements: ExcalidrawElementSkeleton[] = [];

  children.forEach((child, index) => {
    const childX = getNextX(rootElementX, xSpacing);
    const childY = getNextY(
      rootElementY,
      index,
      NODE_HEIGHT,
      ySpacing,
      childrenLength,
    );
    const childrenElement = createRectangleElement(
      nanoid(),
      childX,
      childY,
      NODE_WIDTH,
      NODE_HEIGHT,
      child.descr,
    );

    const arrowElement = createArrowElement(
      nanoid(),
      rootElementX + NODE_WIDTH || 0,
      rootElementY + NODE_HEIGHT / 2 || 0,
      childX,
      childY + NODE_HEIGHT / 2,
      rootElementId,
      childrenElement.id || "",
    );

    const nestedElements = createChildrenElements(
      child.children,
      NODE_HEIGHT,
      NODE_WIDTH,
      xSpacing,
      ySpacing / 2,
      childrenElement.id || "",
      childX,
      childY,
    );

    childrenElements.push(childrenElement, arrowElement, ...nestedElements);
  });

  return childrenElements;
};

export const MindmapChartToExcalidrawSkeletonConverter = new GraphConverter({
  converter: (graph: MindmapDiagram, options) => {
    const elements: ExcalidrawElementSkeleton[] = [];
    const fontSize = options.fontSize;

    const INITIAL_X = 0;
    const INITIAL_Y = 0;
    const X_SPACING = 500;
    const Y_SPACING = 400;
    // const ARROW_SIZE = 200;
    const NODE_HEIGHT = 100;
    const NODE_WIDTH = 200;

    const rootTitle = graph.mindmap.descr;
    const rootElement = createRectangleElement(
      nanoid(),
      INITIAL_X,
      INITIAL_Y,
      NODE_WIDTH,
      NODE_HEIGHT,
      rootTitle,
    );
    elements.push(rootElement);

    const rootChildren = graph.mindmap.children;
    const childrenElements = createChildrenElements(
      rootChildren,
      NODE_HEIGHT,
      NODE_WIDTH,
      X_SPACING,
      Y_SPACING,
      rootElement.id || "",
      rootElement.x || 0,
      rootElement.y || 0,
    );

    elements.push(...childrenElements);

    return { elements };
  },
});
