/* eslint-disable prettier/prettier */
import { Diagram } from "mermaid/dist/Diagram.js";

export interface JourneyDiagram {
  type: "journeyDiagram";
  title: string;
  actors: string[];
  sections: string[];
  tasks: Task[];
}

type Task = {
  section: string;
  type: string;
  people: string[];
  task: string;
  score: number;
};

export const parseMermaidJourneyDiagram = (
  diagram: Diagram,
  containerEl: Element,
): JourneyDiagram => {
  diagram.parse();

  // @ts-ignore
  const mermaidParser = diagram.parser.yy;

  const title = mermaidParser.getDiagramTitle();
  const actors = mermaidParser.getActors();
  const sections = mermaidParser.getSections();
  const tasks = mermaidParser.getTasks();

  return {
    type: "journeyDiagram",
    title,
    actors,
    sections,
    tasks,
  };
};
