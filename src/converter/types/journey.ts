/* eslint-disable prettier/prettier */
import { GraphConverter } from "../GraphConverter.js";
import { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/types/data/transform.js";
import { JourneyDiagram } from "../../parser/journey.js";
import {
  COLORS,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
} from "../../constants.js";
import { GraphImageConverter } from "./graphImage.js";
import { nanoid } from "nanoid";
import { BinaryFiles } from "@excalidraw/excalidraw/types/types.js";
import { FileId } from "@excalidraw/excalidraw/types/element/types.js";

const FACE_EXPRESSION_SVG = {
  1: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 16C16 16 14.5 14 12 14C9.5 14 8 16 8 16M17 9.24C16.605 9.725 16.065 10 15.5 10C14.935 10 14.41 9.725 14 9.24M10 9.24C9.605 9.725 9.065 10 8.5 10C7.935 10 7.41 9.725 7 9.24M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `,
  2: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 16C16 16 14.5 14 12 14C9.5 14 8 16 8 16M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9ZM9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>  
    `,
  3: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 15H16M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9ZM9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `,
  4: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9ZM9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `,
  5: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 9H15.01M9 9H9.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9ZM9.5 9C9.5 9.27614 9.27614 9.5 9 9.5C8.72386 9.5 8.5 9.27614 8.5 9C8.5 8.72386 8.72386 8.5 9 8.5C9.27614 8.5 9.5 8.72386 9.5 9ZM12 17.5C14.5005 17.5 16.5 15.667 16.5 14H7.5C7.5 15.667 9.4995 17.5 12 17.5Z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `,
};

export const JourneyDiagramToExcalidrawSkeletonConverter = new GraphConverter({
  converter: (graph: JourneyDiagram, options) => {
    const elements: ExcalidrawElementSkeleton[] = [];
    let files: BinaryFiles = {};
    const fontSize = options.fontSize;

    const INITIAL_X = 100;
    const INITIAL_Y = 100;

    const TASK_DISTANCE = 20;
    const SECTION_DISTANCE = 50;
    const MIN_TASK_WIDTH = 200;
    const MIN_TASK_HEIGHT = 70;
    const LINE_HEIGHT = 500;

    const FACE_EXPRESSION = {
      1: "face-sad",
      2: "face-frown",
      3: "face-neutral",
      4: "face-smile",
      5: "face-happy",
    };
    const getFaceExpression = (rating: number) => {
      const ratingKey = rating as keyof typeof FACE_EXPRESSION;
      const dataURL = `data:image/svg+xml;base64,${btoa(
        FACE_EXPRESSION_SVG[ratingKey],
      )}`;

      return dataURL;
    };

    let previousSectionWidth = 0;

    graph.sections.forEach((section) => {
      const sectionTasks = graph.tasks.filter(
        (task) => task.section === section,
      );
      const sectionWidth =
        sectionTasks.length * MIN_TASK_WIDTH +
        TASK_DISTANCE * (sectionTasks.length - 1);

      const sectionElement: ExcalidrawElementSkeleton = {
        type: "rectangle",
        x: INITIAL_X + previousSectionWidth,
        y: INITIAL_Y,
        width: sectionWidth,
        height: MIN_TASK_HEIGHT,
        backgroundColor: COLORS.BACKGROUND,
        strokeColor: COLORS.STROKE,
        roughness: 0,
        roundness: {
          type: 3,
        },
        label: {
          text: section,
          fontSize: 20,
          verticalAlign: "center",
          fontFamily: DEFAULT_FONT_FAMILY,
        },
      };

      elements.push(sectionElement);

      sectionTasks.forEach((task, taskIndex) => {
        const taskElement: ExcalidrawElementSkeleton = {
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
          roundness: {
            type: 3,
          },
          label: {
            text: task.task,
            fontSize: 20,
            verticalAlign: "center",
            fontFamily: DEFAULT_FONT_FAMILY,
          },
        };

        const lineElement: ExcalidrawElementSkeleton = {
          type: "line",
          x:
            INITIAL_X +
            previousSectionWidth +
            taskIndex * (MIN_TASK_WIDTH + TASK_DISTANCE) +
            MIN_TASK_WIDTH / 2,
          y: taskElement.y + (taskElement.height || 0),
          width: 0.1,
          height: LINE_HEIGHT,
          backgroundColor: "transparent",
          strokeColor: COLORS.BLACK,
          strokeStyle: "dotted",
          roughness: 0,
        };

        const imageId = nanoid() as FileId;

        const EMOJI_WIDTH = 40;
        const EMOJI_HEIGHT = 40;
        const imageElement: ExcalidrawElementSkeleton = {
          type: "image",
          x: lineElement.x - EMOJI_WIDTH / 2,
          y: lineElement.y + (5 - task.score) * 100 + 100,
          width: EMOJI_WIDTH,
          height: EMOJI_HEIGHT,
          status: "saved",
          fileId: imageId,
        };
        const newFiles = {
          [imageId]: {
            id: imageId,
            mimeType: "image/svg+xml",
            dataURL: getFaceExpression(task.score),
          },
        } as BinaryFiles;

        files = { ...files, ...newFiles };
        elements.push(imageElement);
        elements.push(lineElement);
        elements.push(taskElement);
      });

      previousSectionWidth += sectionWidth + SECTION_DISTANCE;
    });

    // Convert title
    const title = graph.title;
    const titleElement: ExcalidrawElementSkeleton = {
      type: "text",
      x: INITIAL_X,
      y: INITIAL_Y - 100,
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
    elements.push(titleElement);

    const arrowElement: ExcalidrawElementSkeleton = {
      type: "arrow",
      x: INITIAL_X,
      y: INITIAL_Y + 2 * MIN_TASK_HEIGHT + 50,
      width: previousSectionWidth - SECTION_DISTANCE,
      height: 0,
      endArrowhead: "triangle",
      strokeColor: COLORS.BLACK,
      roughness: 0,
    };
    elements.push(arrowElement);

    return {
      elements,
      files,
    };
  },
});
