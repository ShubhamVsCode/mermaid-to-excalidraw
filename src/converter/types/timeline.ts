/* eslint-disable prettier/prettier */
import { GraphConverter } from "../GraphConverter.js";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform.js";
import { COLORS, DEFAULT_FONT_FAMILY } from "../../constants.js";
import { TimelineDiagram } from "../../parser/timeline.js";

const INITIAL_X = 100;
const INITIAL_Y = 100;
const TASK_DISTANCE = 20;
const SECTION_DISTANCE = 50;
const MIN_TASK_WIDTH = 200;
const MIN_TASK_HEIGHT = 70;
const LINE_HEIGHT = 350;

function createSectionElement(
  section: string,
  previousSectionWidth: number,
  sectionWidth: number,
): ExcalidrawElementSkeleton {
  return {
    type: "rectangle",
    x: INITIAL_X + previousSectionWidth,
    y: INITIAL_Y,
    width: sectionWidth,
    height: MIN_TASK_HEIGHT,
    backgroundColor: COLORS.BACKGROUND,
    strokeColor: COLORS.STROKE,
    roughness: 0,
    label: {
      text: section,
      fontSize: 20,
      verticalAlign: "center",
      fontFamily: DEFAULT_FONT_FAMILY,
    },
  };
}

function createTaskElement(
  task: any,
  taskIndex: number,
  previousSectionWidth: number,
): ExcalidrawElementSkeleton {
  return {
    type: "rectangle",
    x:
      INITIAL_X +
      previousSectionWidth +
      taskIndex * (MIN_TASK_WIDTH + TASK_DISTANCE),
    y: INITIAL_Y + MIN_TASK_HEIGHT + 20,
    width: MIN_TASK_WIDTH,
    height: MIN_TASK_HEIGHT,
    backgroundColor: COLORS.BACKGROUND,
    strokeColor: COLORS.STROKE,
    roughness: 0,
    label: {
      text: task.task,
      fontSize: 20,
      verticalAlign: "center",
      fontFamily: DEFAULT_FONT_FAMILY,
    },
  };
}

function createEventElement(
  event: string,
  taskElement: ExcalidrawElementSkeleton,
  eventIndex: number,
): ExcalidrawElementSkeleton {
  return {
    type: "rectangle",
    x: taskElement.x || 0,
    y: (taskElement.y || 0) + 150 + eventIndex * 150,
    width: MIN_TASK_WIDTH,
    height: MIN_TASK_HEIGHT,
    backgroundColor: COLORS.BACKGROUND,
    strokeColor: COLORS.STROKE,
    roughness: 0,
    // roundness: {
    //   type: 3,
    // },
    label: {
      text: event,
      fontSize: 16,
      verticalAlign: "center",
      fontFamily: DEFAULT_FONT_FAMILY,
    },
  };
}

function createEventArrowElement(
  taskElement: ExcalidrawElementSkeleton,
  taskIndex: number,
  previousSectionWidth: number,
): ExcalidrawElementSkeleton {
  return {
    type: "arrow",
    x:
      INITIAL_X +
      previousSectionWidth +
      taskIndex * (MIN_TASK_WIDTH + TASK_DISTANCE) +
      MIN_TASK_WIDTH / 2,
    y: (taskElement.y || 0) + (taskElement.height || 0),
    width: 0.1,
    height: LINE_HEIGHT,
    backgroundColor: "transparent",
    strokeColor: COLORS.BLACK,
    strokeStyle: "dotted",
    roughness: 0,
    endArrowhead: "triangle",
  };
}

function createTitleElement(
  title: string,
  sectionsLength: number,
): ExcalidrawElementSkeleton {
  return {
    type: "text",
    x: INITIAL_X,
    y: sectionsLength === 0 ? INITIAL_Y : INITIAL_Y - 100,
    backgroundColor: "transparent",
    strokeColor: COLORS.STROKE,
    roughness: 0,
    text: title,
    angle: 0,
    textAlign: "left",
    verticalAlign: "center",
    fontSize: 30,
    fontFamily: DEFAULT_FONT_FAMILY,
  };
}

function createArrowElement(
  previousSectionWidth: number,
): ExcalidrawElementSkeleton {
  return {
    type: "arrow",
    x: INITIAL_X,
    y: INITIAL_Y + 2 * MIN_TASK_HEIGHT + 50,
    width: previousSectionWidth - SECTION_DISTANCE,
    height: 0,
    endArrowhead: "triangle",
    strokeColor: COLORS.BLACK,
    roughness: 0,
  };
}

export const TimelineDiagramToExcalidrawSkeletonConverter = new GraphConverter({
  converter: (graph: TimelineDiagram, options) => {
    const elements: ExcalidrawElementSkeleton[] = [];
    let previousSectionWidth = 0;

    const sectionsLength = graph.sections.length;

    if (sectionsLength > 0) {
      graph.sections.forEach((section) => {
        const sectionTasks = graph.tasks.filter(
          (task) => task.section === section,
        );
        const sectionWidth =
          sectionTasks.length * MIN_TASK_WIDTH +
          TASK_DISTANCE * (sectionTasks.length - 1);

        const sectionElement = createSectionElement(
          section,
          previousSectionWidth,
          sectionWidth,
        );
        elements.push(sectionElement);

        sectionTasks.forEach((task, taskIndex) => {
          const taskElement = createTaskElement(
            task,
            taskIndex,
            previousSectionWidth,
          );
          const eventArrowElement = createEventArrowElement(
            taskElement,
            taskIndex,
            previousSectionWidth,
          );

          const eventElements = task.events.map((event, eventIndex) => {
            const eventElement = createEventElement(
              event,
              taskElement,
              eventIndex,
            );
            return eventElement;
          });

          elements.push(eventArrowElement);
          elements.push(taskElement);
          elements.push(...eventElements);
        });

        previousSectionWidth += sectionWidth + SECTION_DISTANCE;
      });
    } else {
      const tasks = Array.from(new Set(graph.tasks));
      tasks.forEach((task, taskIndex) => {
        const taskElement = createTaskElement(
          task,
          taskIndex,
          previousSectionWidth,
        );
        const eventArrowElement = createEventArrowElement(
          taskElement,
          taskIndex,
          previousSectionWidth,
        );

        const eventElements = task.events.map((event, eventIndex) => {
          const eventElement = createEventElement(
            event,
            taskElement,
            eventIndex,
          );
          return eventElement;
        });

        elements.push(eventArrowElement);
        elements.push(taskElement);
        elements.push(...eventElements);
      });
      previousSectionWidth =
        tasks.length * MIN_TASK_WIDTH +
        TASK_DISTANCE * (tasks.length - 1) +
        SECTION_DISTANCE;
    }

    const titleElement = createTitleElement(graph.title, sectionsLength);
    elements.push(titleElement);
    const arrowElement = createArrowElement(previousSectionWidth);
    elements.push(arrowElement);

    return { elements };
  },
});
