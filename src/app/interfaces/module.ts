export interface Module {
  name: string;
  description: string;
  inputFile: string;
  outputFile_req: boolean;
  outputFile?: string;
  params: string;
  command: string;
}
