import { Module } from './../interfaces/module';
import { ModulesService } from './../services/modules.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-new-module',
  templateUrl: './new-module.component.html',
  styleUrls: ['./new-module.component.css']
})
export class NewModuleComponent implements OnInit {

  public newModuleForm: FormGroup;
  public fileIsRead = null;
  public userModules = this.modulesService.userModules;

  constructor(private fb: FormBuilder,
              private modulesService: ModulesService) {
    this.createForm();
   }

  ngOnInit() {
  }

  createForm() {
    this.newModuleForm = this.fb.group({
      name: ['',
        [Validators.required],
      ],
      description: ['',
        [Validators.required]
      ],
      inputFile: ['',
        [Validators.required]
      ],
      outputFile_required: ['true',
        [Validators.required]
      ],
      outputFile: ['',
      ],
      params: ['',
        [Validators.required]
      ],
      command: ['',
        [Validators.required]
      ],
      file: [null,
        [Validators.required]]
    });
  }

  toggleOutputFileField(disable: boolean) {
    if (disable) {
      this.newModuleForm.controls['outputFile'].disable();
    } else {
      this.newModuleForm.controls['outputFile'].enable();
    }
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      // const file = event.target.files[0];
      const file = (event.target as HTMLInputElement).files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('here');
        this.fileIsRead = true;
      };
    }
  }

  submitForm() {
    console.log('here');
    const data: Module = this.newModuleForm.value;
    this.modulesService.addNewUserModule(data);
    // this.modulesService.postNewModule(data);
  }

  isValid() {
    const isValid = this.newModuleForm.valid;
    return isValid;
  }

}
