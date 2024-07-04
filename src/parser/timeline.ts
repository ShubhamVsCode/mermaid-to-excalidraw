/* eslint-disable prettier/prettier */
import { Diagram } from "mermaid/dist/Diagram.js";

export interface TimelineDiagram {
  type: "timelineDiagram";
  title: string;
  sections: string[];
  tasks: Task[];
}

type Task = {
  section: string;
  type: string;
  task: string;
  score: number;
  events: string[];
};

export const parseMermaidTimelineDiagram = (
  diagram: Diagram,
  containerEl: Element,
): TimelineDiagram => {
  diagram.parse();

  // @ts-ignore
  const mermaidParser = diagram.parser.yy;

  console.log(mermaidParser.getSections());
  console.log(mermaidParser.getTasks());
  console.log(mermaidParser.getCommonDb().getDiagramTitle());

  const sections = mermaidParser.getSections();
  const tasks = mermaidParser.getTasks();
  const title = mermaidParser.getCommonDb().getDiagramTitle();

  return {
    type: "timelineDiagram",
    sections,
    tasks,
    title,
  };
};
