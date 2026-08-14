/// <reference types="vite/client" />

declare module '*.svg' {
  const content: string;
  export default content;
}

declare module 'frappe-gantt-react' {
  export interface Task {
    id: string;
    name: string;
    start: string;
    end: string;
    progress?: number;
    dependencies?: string | string[];
    custom_class?: string;
  }

  export enum ViewMode {
    QuarterDay = 'Quarter Day',
    HalfDay = 'Half Day',
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Year = 'Year',
  }

  export interface FrappeGanttProps {
    tasks: Task[];
    viewMode?: ViewMode;
    onDateChange?: (task: Task, start: any, end: any) => void;
    onProgressChange?: (task: Task, progress: number) => void;
    onTasksChange?: (tasks: Task[]) => void;
    onClick?: (task: Task) => void;
  }

  export const FrappeGantt: React.FC<FrappeGanttProps>;
}