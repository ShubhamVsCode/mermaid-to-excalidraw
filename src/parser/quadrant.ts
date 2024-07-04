/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import { Diagram } from "mermaid/dist/Diagram.js";

export interface QuadrantChart {
  type: "quadrantChart";
  quadrantsData: QuadrantChartData;
}

type Text = {
  text: string;
  fill: string;
  x: number;
  y: number;
  verticalPos: string;
  horizontalPos: string;
  fontSize: number;
  rotation: number;
};

type Point = {
  x: number;
  y: number;
  fill: string;
  radius: number;
  text: Text;
};

type Quadrant = {
  text: Text;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
};

type AxisLabel = {
  text: string;
  fill: string;
  x: number;
  y: number;
  fontSize: number;
  verticalPos: string;
  horizontalPos: string;
  rotation: number;
};

type BorderLine = {
  strokeFill: string;
  strokeWidth: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Title = {
  text: string;
  fill: string;
  fontSize: number;
  horizontalPos: string;
  verticalPos: string;
  rotation: number;
  y: number;
  x: number;
};

type QuadrantChartData = {
  points: Point[];
  quadrants: Quadrant[];
  axisLabels: AxisLabel[];
  borderLines: BorderLine[];
  title: Title;
};

export const parseMermaidQuadrantChart = (
  diagram: Diagram,
  containerEl: Element,
): QuadrantChart => {
  diagram.parse();

  // @ts-ignore
  const mermaidParser = diagram.parser.yy;

  const quadrantData: QuadrantChartData = mermaidParser.getQuadrantData();
  const points = quadrantData.points;
  const quadrants = quadrantData.quadrants;
  const axisLabels = quadrantData.axisLabels;
  const borderLines = quadrantData.borderLines;
  const title = quadrantData.title;

  return {
    type: "quadrantChart",
    quadrantsData: {
      points,
      quadrants,
      axisLabels,
      borderLines,
      title,
    },
  };
};
