/* eslint-disable prettier/prettier */
import { Diagram } from "mermaid/dist/Diagram.js";

export interface MindmapDiagram {
  type: "mindmapDiagram";
  mindmap: Mindmap;
}

export type Node = {
  id: number;
  nodeId: string;
  level: number;
  descr: string;
  type: number;
  children: Node[];
  width?: number;
  padding?: number;
  icon?: string;
};

type Mindmap = {
  id: number;
  nodeId: string;
  level: number;
  descr: string;
  type: number;
  children: Node[];
  width?: number;
  padding?: number;
};

export const parseMermaidMindmapDiagram = (
  diagram: Diagram,
  containerEl: Element,
): MindmapDiagram => {
  diagram.parse();

  // @ts-ignore
  const mermaidParser = diagram.parser.yy;
  const mindmap = mermaidParser.getMindmap();
  const nodeType = mermaidParser.nodeType;

  return {
    type: "mindmapDiagram",
    mindmap,
  };
};
