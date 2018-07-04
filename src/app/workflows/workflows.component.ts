import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl, FormsModule } from '@angular/forms';
import { Module } from './../interfaces/module';
import { ModulesService } from './../services/modules.service';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.css']
})
export class WorkflowsComponent implements OnInit {

  public modules: Module[] = [];
  public userPickedModules: Module[] = [];
  public moduleNames: string[] = [];
  public isLoading: boolean;
  public workflowForm: FormGroup;
  public workflow: string[] = [];
  public inputsForm: FormGroup;
  public inputsFormCreated: boolean;
  public workflowString: string;

  constructor(private fb: FormBuilder,
    private modulesService: ModulesService) { }

  ngOnInit() {
    this.createWorkflowForm();
    this.modulesService.getAllModules()
      .subscribe(
      (data: any) => {
        console.log(data);
        const rawModules: any[] = data.modules.module;
        rawModules.map(element => {
          let outputFileReqFlag;

          if (element['outputFile_required'] === 'true') {
            outputFileReqFlag = true;
          } else {
            outputFileReqFlag = false;
          }

          const module: Module = {
            name: element['name'],
            category: element['category'],
            description: element['description'],
            inputFile: element['inputFile'],
            outputFile_required: outputFileReqFlag,
            outputFile: element['outputFile'],
            command: element['command'],
            params: element['params'],
          };
          this.moduleNames.push(module.name);
          this.modules.push(module);
        });

        const userModules = this.modulesService.userModules;
        if (userModules.length > 0) {
          this.modules = this.modules.concat(userModules);
        }
        console.log(this.modules);
        this.isLoading = false;
      }
    );
  }

  public createWorkflowForm() {
    this.workflowForm = this.fb.group({
      uniqueId: ['',
        [Validators.required]
      ],
      outputFolder: ['',
        [Validators.required]
      ],
      module: ['',
        [Validators.required],
      ],
    });
  }

  public addModuleToWorkflow() {
    const moduleToAdd = this.workflowForm.get('module').value;
    this.workflow.push(moduleToAdd);
    this.createWorkflowString();
  }

  private createWorkflowString() {
    this.workflowString = '';
    this.workflow.map( x => {
      this.workflowString = this.workflowString + x + '-->';
    });
    this.workflowString = this.workflowString.substring(0, this.workflowString.length - 3);
  }

  public createInputsForm() {
    this.inputsForm = this.fb.group({
      inputs: this.fb.array([])
    });

    this.workflow.map(x => {
      (<FormArray>this.inputsForm.get('inputs')).push(this.createInputForm());
    });
    this.userPickedModules = [];

    this.workflow.map( x => {
      console.log(x);
      if (this.modules.findIndex(j => j.name === x) !== -1) {
        this.userPickedModules.push(this.modules.find(j => j.name === x));
      }
    });
    this.inputsFormCreated = true;
  }

  createInputForm() {
    const input = new FormGroup({
      'name': new FormControl(''),
      'params': new FormControl('', Validators.required),
      'inputFile': new FormControl('', Validators.required),
      'outputFile': new FormControl(''),
    });

    return input;
  }

  /** This needs to be implemented */
  createInputFile() {
    this.addModuleNamesToForm();
    const workflow = this.getWorkflowAsString();
    const outputFolder = this.workflowForm.get('outputFolder').value;
    const uniqueId = this.workflowForm.get('uniqueId').value;

    const modules = {
      module: []
    };

    (<FormArray>this.inputsForm.get('inputs')).controls.map( x => {
      const name = x.get('name').value;
      const inputFile = x.get('inputFile').value;
      const outputFile = x.get('outputFile').value;
      const params = x.get('params').value;
      const inputStr = this.getInputString(inputFile, outputFile, params);
      const module = {
        name: name,
        input: inputStr
      };
      modules.module.push(module);
    });

    const data = {
      inputConfig: {
        workflow : workflow,
        outputFolder: outputFolder,
        uniqueId: uniqueId,
        modules: modules
      }
    };
    console.log(data);
    this.modulesService.generateInputXml(data).subscribe( (resData) => {
      console.log(resData);
    });
  }

  getWorkflowAsString(): string {
    let workflow = '';
    this.workflow.map( x => workflow = workflow + x + ',');
    workflow = workflow.substring(0, workflow.length - 1);
    return workflow;
  }

  getInputString(inputfile: string, outputfile: string, params: string): string {
    const inputStr = `["Inputfile:${inputfile}","outputfile:${outputfile}","${params}"]`;
    return inputStr;
  }

  addModuleNamesToForm(): void {
    for (let i = 0; i < this.workflow.length; i++) {
      const name: string = this.workflow[i];
      (<FormArray>this.inputsForm.get('inputs')).at(i).get('name').patchValue(name);
    }
  }

  formIsValid(): boolean {
    const workflowValid = this.workflow.length > 1;
    const formValid = this.workflowForm.valid;
    let valid: boolean;
    if (workflowValid && formValid) {
      valid = true;
    } else {
      valid = false;
    }
    return valid;
  }

  inputsFormIsValid(): boolean {
    const formValid = this.inputsForm.valid;
    return formValid;
  }

  updateNextInputField(event, index: number) {
    if ((<FormArray>this.inputsForm.get('inputs')).at(index + 1) !== undefined) {
      (<FormArray>this.inputsForm.get('inputs')).at(index + 1).get('inputFile').patchValue(event);
      (<FormArray>this.inputsForm.get('inputs')).at(index + 1).get('inputFile').updateValueAndValidity();
    }
  }

  get module() { return this.workflowForm.get('module'); }
  get inputs() { return this.inputsForm.get('inputs'); }
  get uniqueId() { return this.workflowForm.get('uniqueId'); }
  get outputFolder() { return this.workflowForm.get('outputFolder'); }
}
