export interface Module {
  name: string;
  category: string;
  description: string;
  inputFile: string;
  outputFile_required: boolean;
  outputFile?: string;
  params: string;
  command: string;
  file?: File;
}
