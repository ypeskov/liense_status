import { LightningElement, track, wire } from 'lwc';

import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Project_Plan__c.Stage__c',
    'Project_Plan__c.Name',
    'Project_Plan__c.Current_Stage_Action__c',
    'Project_Plan__c.Status_Note__c',
    'Project_Plan__c.LastModifiedDate',
    'Project_Plan__c.Projected_P3_Completion_Date__c',
];

export default class Astrolabs_stage_description extends LightningElement {
    @track currentStageAction
    @track currentStage
    @track projectName
    @track statusNotes
    @track projectEndDate
    @track lastUpdated

    @wire(getRecord, { recordId: 'a004K000001BFNdQAO', fields: FIELDS })
    wiredRecord({error, data}) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
        } else if (data) {
            this.currentStageAction = data.fields.Current_Stage_Action__c.value
            this.currentStage = data.fields.Stage__c.displayValue
            this.projectName = data.fields.Name.value
            this.statusNotes = data.fields.Status_Note__c.value
            this.projectEndDate = data.fields.Projected_P3_Completion_Date__c.displayValue
            this.lastUpdated = data.fields.LastModifiedDate.displayValue
        }
    }
}