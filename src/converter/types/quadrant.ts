import { GraphConverter } from "../GraphConverter.js";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform.js";
import { QuadrantChart } from "../../parser/quadrant.js";
import { COLORS, DEFAULT_FONT_FAMILY } from "../../constants.js";

export const QuadrantChartToExcalidrawSkeletonConverter = new GraphConverter({
  converter: (graph: QuadrantChart, options) => {
    const elements: ExcalidrawElementSkeleton[] = [];
    const fontSize = options.fontSize;

    // Convert quadrants
    graph.quadrantsData.quadrants.forEach((q) => {
      const containerElement: ExcalidrawElementSkeleton = {
        type: "rectangle",
        x: q.x,
        y: q.y,
        width: q.width,
        height: q.height,
        backgroundColor: q.fill,
        strokeColor: COLORS.STROKE,
        roughness: 0,
        label: {
          text: q.text.text,
          fontSize,
          verticalAlign: "top",
          fontFamily: DEFAULT_FONT_FAMILY,
        },
      };
      elements.push(containerElement);
    });

    // Convert points
    graph.quadrantsData.points.forEach((p) => {
      const pointElement: ExcalidrawElementSkeleton = {
        type: "ellipse",
        x: p.x,
        y: p.y,
        width: p.radius * 2,
        height: p.radius * 2,
        backgroundColor: p.fill,
        strokeColor: COLORS.STROKE,
        roughness: 0,
      };
      elements.push(pointElement);

      const pointLabelElement: ExcalidrawElementSkeleton = {
        type: "text",
        x: p.x,
        y: p.y + p.radius + 5, // Position the text just below the point
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        strokeColor: COLORS.STROKE,
        roughness: 0,
        text: p.text.text,
        fontSize: p.text.fontSize,
        verticalAlign: "top",
        fontFamily: DEFAULT_FONT_FAMILY,
      };
      elements.push(pointLabelElement);
    });

    // Convert axis labels
    graph.quadrantsData.axisLabels.forEach((label) => {
      const labelElement: ExcalidrawElementSkeleton = {
        type: "text",
        x: label.x - 60,
        y: label.y,
        backgroundColor: "transparent",
        strokeColor: COLORS.STROKE,
        roughness: 0,
        text: label.text,
        fontSize: label.fontSize,
        verticalAlign: label.verticalPos,
        angle: label.rotation === -90 ? (Math.PI * 3) / 2 : 0,
        fontFamily: DEFAULT_FONT_FAMILY,
      };
      elements.push(labelElement);
    });

    // Convert border lines
    graph.quadrantsData.borderLines.forEach((line) => {
      const lineElement: ExcalidrawElementSkeleton = {
        type: "line",
        x: line.x1,
        y: line.y1,
        width: 1,
        height: line.y2 - line.y1,
        backgroundColor: "transparent",
        strokeColor: COLORS.STROKE,
        strokeWidth: line.strokeWidth,
        roughness: 0,
      };
      elements.push(lineElement);
    });

    // Convert title
    const title = graph.quadrantsData.title;
    const titleElement: ExcalidrawElementSkeleton = {
      type: "text",
      x: title.x,
      y: title.y,
      backgroundColor: "transparent",
      strokeColor: COLORS.STROKE,
      roughness: 0,
      text: title.text,
      fontSize: title.fontSize,
      verticalAlign: title.horizontalPos,
      textAlign: title.verticalPos,
      angle: title.rotation,
      fontFamily: DEFAULT_FONT_FAMILY,
    };
    elements.push(titleElement);

    return {
      elements,
    };
  },
});
