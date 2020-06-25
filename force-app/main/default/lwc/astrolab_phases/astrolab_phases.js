import { LightningElement, track, wire, api } from 'lwc';

import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Project_Plan__c.Projected_P1_Completion_Date__c',
    'Project_Plan__c.Projected_P2_Completion_Date__c',
    'Project_Plan__c.Projected_P3_Completion_Date__c',
    'Project_Plan__c.P1_Start_Date__c',
    'Project_Plan__c.P2_Start_Date__c',
    'Project_Plan__c.P2_Start_Date__c',
];  

export default class Astrolab_phases extends LightningElement {
    @api stageOrder

    @track phaseStartDate
    @track phaseEndDate
    @track stageDescription
    @track stageLength

    connectedCallback() {
        this.stageOrder = parseInt(this.stageOrder, 10)
        switch(this.stageOrder) {
            case 1:
                this.stageDescription = 'Establishing a Legal Entity'
                this.stageLength = '(2-3 weeks)'
                break;
            case 2:
                this.stageDescription = 'Portals Registration & GM Visa'
                this.stageLength = '(3-4 weeks)'
                break;
            case 3:
                this.stageDescription = 'Residency & Setup Finalization'
                this.stageLength = '(5-6 weeks)'
                break;
        }
    }

    renderedCallback() {
        const phaseContainer = this.template.querySelector(".phase-container")
        phaseContainer.classList.add(`phase${this.stageOrder}`)
    }

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
            switch (this.stageOrder) {
                case 1:
                    this.phaseStartDate = data.fields.P1_Start_Date__c.displayValue
                    this.phaseEndDate = data.fields.Projected_P1_Completion_Date__c.displayValue
                    break;  
                case 2:
                    this.phaseStartDate = data.fields.P2_Start_Date__c.displayValue
                    this.phaseEndDate = data.fields.Projected_P2_Completion_Date__c.displayValue
                    break;
                case 3:
                    this.phaseStartDate = data.fields.P2_Start_Date__c.displayValue
                    this.phaseEndDate = data.fields.Projected_P3_Completion_Date__c.displayValue
                    break;
            }
            
        }
    } 
}