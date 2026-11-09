export interface ITaskData {
  project_id: number | undefined;
  name: string;
  description: string;
  priority: number;
  participant: number[];
  point: number;
}