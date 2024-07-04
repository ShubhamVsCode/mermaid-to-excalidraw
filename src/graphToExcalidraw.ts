import { MermaidOptions } from "./index.js";
import { FlowchartToExcalidrawSkeletonConverter } from "./converter/types/flowchart.js";
import { GraphImageConverter } from "./converter/types/graphImage.js";
import { GraphImage, MermaidToExcalidrawResult } from "./interfaces.js";
import { SequenceToExcalidrawSkeletonConvertor } from "./converter/types/sequence.js";
import { Sequence } from "./parser/sequence.js";
import { Flowchart } from "./parser/flowchart.js";
import { Class } from "./parser/class.js";
import { classToExcalidrawSkeletonConvertor } from "./converter/types/class.js";
import { QuadrantChart } from "./parser/quadrant.js";
import { QuadrantChartToExcalidrawSkeletonConverter } from "./converter/types/quadrant.js";
import { JourneyDiagram } from "./parser/journey.js";
import { JourneyDiagramToExcalidrawSkeletonConverter } from "./converter/types/journey.js";
import { MindmapDiagram } from "./parser/mindmap.js";
import { MindmapChartToExcalidrawSkeletonConverter } from "./converter/types/mindmap.js";
import { TimelineDiagramToExcalidrawSkeletonConverter } from "./converter/types/timeline.js";
import { TimelineDiagram } from "./parser/timeline.js";

export const graphToExcalidraw = (
  graph:
    | Flowchart
    | GraphImage
    | Sequence
    | Class
    | QuadrantChart
    | JourneyDiagram
    | MindmapDiagram
    | TimelineDiagram,
  options: MermaidOptions = {},
): MermaidToExcalidrawResult => {
  switch (graph.type) {
    case "graphImage": {
      return GraphImageConverter.convert(graph, options);
    }

    case "flowchart": {
      return FlowchartToExcalidrawSkeletonConverter.convert(graph, options);
    }

    case "sequence": {
      return SequenceToExcalidrawSkeletonConvertor.convert(graph, options);
    }

    case "class": {
      return classToExcalidrawSkeletonConvertor.convert(graph, options);
    }

    case "quadrantChart": {
      return QuadrantChartToExcalidrawSkeletonConverter.convert(graph, options);
    }

    case "journeyDiagram": {
      return JourneyDiagramToExcalidrawSkeletonConverter.convert(
        graph,
        options,
      );
    }

    case "mindmapDiagram": {
      return MindmapChartToExcalidrawSkeletonConverter.convert(graph, options);
    }

    case "timelineDiagram": {
      return TimelineDiagramToExcalidrawSkeletonConverter.convert(
        graph,
        options,
      );
    }

    default: {
      throw new Error(
        `graphToExcalidraw: unknown graph type "${
          (graph as any).type
        }, only flowcharts are supported!"`,
      );
    }
  }
};
