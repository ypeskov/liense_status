import { LightningElement, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getProjectPlanByUserId from '@salesforce/apex/ProjectPlan.getProjectPlanByUserId';
import getTasksValues from '@salesforce/apex/ProjectPlan.getTasksValues';
import getDependencyMap from '@salesforce/apex/DependencyExtraction.getDependencyMap';

export default class License_status extends LightningElement {
    @track phases = {
        phase1: {
            order: 1,
            title: 'Establishing a Legal Entity (2-3 Weeks)',
            isActive: true,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
            tasks: [],
        },
        phase2: {
            order: 2,
            title: 'Portals Registration & GM Visa (3-4 Weeks)',
            isActive: false,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
            tasks: [],
        },
        phase3: {
            order: 3,
            title: 'Residency & Setup Finalisation (5-6 Weeks)',
            isActive: false,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
            tasks: [],
        }
    };

    @track projectDetails = {
        Project_Stage__c: '',
        Project_Tasks__c: '',
        Stage_Action__c: '',
        Status_Note__c: '',
    };

    stages = {
        //------- Phase 1 
        'MISA License': ['MISA_License_Projected_Completion__c', 1],
        'Articles of Association': ['Articles_of_Assoc_Projected_Completion__c', 1],
        'Company Registration': ['Company_reg_Projected_Completion__c', 1],
        'Chamber of Commerce': ['Chamber_of_Commerce_Projected_Completion__c', 1],
        //-----------Phase 2
        'Ministry of Labor': ['Ministry_of_Labor_Projected_Completion__c', 2],
        'Zakat': ['Zakat_Projected_Completion__c', 2],
        'Company Stamp': ['Company_Stamp_Forecasted_Completion__c', 2],
        'GM Visa': ['GM_Visa_Forecasted_Completion__c', 2],
        //-------- Phase 3
        'Residency': ['Residency_Forecasted_Completion__c', 3],
        'Handover / Closure': ['Handover_Projected_Completion__c', 3]
    };

    mapProjectedStartDate2ActualEndPrev = {
        'MISA_License_Projected_Completion__c': 'Project_Start_Date__c',
        'Articles_of_Assoc_Projected_Completion__c': 'MISA_License_Actual_Completion__c',
        'Company_reg_Projected_Completion__c': 'Articles_of_Assoc_Actual_Completion__c',
        'Chamber_of_Commerce_Projected_Completion__c': 'Company_Reg_Actual_Completion__c',
        //phase 2
        'Ministry_of_Labor_Projected_Completion__c': 'Chamber_of_Commerce_Actual_Completion__c',
        'Zakat_Projected_Completion__c': 'Ministry_of_Labour_Actual_Completion__c',
        'Company_Stamp_Forecasted_Completion__c': 'Zakat_Actual_Completion__c',
        'GM_Visa_Forecasted_Completion__c': 'Company_Stamp_Actual_Completion__c',
        //phase 3
        'Residency_Forecasted_Completion__c': 'GM_VIsa_Actual_Completion__c',
        'Handover_Projected_Completion__c': 'Residency_Actual_Completion__c',
    };

    // tasksPerPhase = {
    //     phase1: [
    //         'Power of Attorney Drafting',
    //         'Application Details Completion',
    //         'Company Name Reservation',
    //         'MISA License Application',
    //         'MISA License Issuance',
    //         'MISA Portal Access Details',
    //         'Authorized Signatory Assigning',
    //         'Article of Association Preparation',
    //         'AoA Review & Approval by MoC',
    //     ],
    //     phase2: [
    //         'Receiving the Physical Documents',
    //         'PoA Local Attestation',
    //         'AoA Signing & Publishing',
    //         'Commercial Registration Issuance',
    //         'Chamber of Commerce Registration',
    //         'Chamber of Commerce Activation',
    //         'Ministry of Labor Registration',
    //         'GOSI Registration',
    //         'General Authority of Zakat & Tax Reg',
    //         'Company Stamp Issuance',
    //         'GM Visa Application',
    //         'GM Visa Office Selection',
    //         'GM Visa Processing (by the Client)',
    //     ],
    //     phase3: [
    //         'GM Trip\'s Details to KSA',
    //         'Border Number Collection (After Landing)',
    //         'KSA Medical Checkup',
    //         'KSA Health Insurance',
    //         'KSA Residency Card Issuance',
    //         'Muqeem Portal Registration',
    //         'Absher Portal Registration',
    //         'Re-entry Visa Issuance',
    //         'Bank Account Docs Preparation',
    //         'Handover Details Shared',
    //     ]
    // }

    finalStructure = {};

    async connectedCallback() {
        let phases, stages;
        try {
            phases = await getDependencyMap({fieldName: 'Project_Stage__c'});
            phases = JSON.parse(JSON.stringify(phases));
        } catch(err) {
            console.log(err);
        }

        try {
            stages = await getDependencyMap({fieldName: 'Project_Tasks__c'});
            // console.log(stages);
        } catch(err) {
            console.log(err);
        }
       
        for(let phaseTitle in phases) {
            this.finalStructure[phaseTitle] = {};
            for(let j=0; j < phases[phaseTitle].length; j++) {
                this.finalStructure[phaseTitle][j] = {
                    order: j, 
                    stageTitle: phases[phaseTitle][j],
                    tasks: stages[phases[phaseTitle][j]]
                };
            }
        }
        
        getProjectPlanByUserId({userId})
        .then(result => {
            this.projectDetails = result;
            this.processResponseData();
        })
        .catch(err => {
            alert('you don\'t have any project');
            console.log('OOOOOOOOPS')
            console.log(err);
        });
    }

    /**
     * process the response and setup values in the current project's phase
     */
    processResponseData() {
        let activePhaseNumber = 1;

        for(let phase in this.phases) {
            let state = this.phases[phase];

            if (state.title === this.projectDetails.Project_Phase__c) {
                activePhaseNumber = state.order;
                this.phases[`phase${activePhaseNumber}`].tasks = this.getTasksForActiveStage(this.projectDetails.Project_Stage__c);
                this.getMarkedTasks(this.projectDetails.Project_Stage__c, this.projectDetails.Project_tasks__c)

                state.isActive = true;
                state.classes = 'phase-box enabled';
            } else {
                state.isActive = false;
            }
        }

        //generate start and end dates
        const currentStage = this.stages[this.projectDetails.Project_Stage__c];
        this.phases[`phase${activePhaseNumber}`].endDate = this.projectDetails[currentStage[0]];
        
        if (activePhaseNumber === currentStage[1]) {
            const prevFieldName = this.mapProjectedStartDate2ActualEndPrev[currentStage[0]];
            this.phases[`phase${activePhaseNumber}`].startDate = this.projectDetails[prevFieldName];
        }

        try {
            this.phases.phase1.startDate = this.projectDetails.Project_Start_Date__c;
            this.phases.phase3.endDate = this.projectDetails.Handover_Projected_Completion__c;
        } catch(err) {
            //do nothing. we don't care and will not display the date
        }

        if (activePhaseNumber === 2) {
            this.phases.phase1.endDate = this.projectDetails.Chamber_of_Commerce_Actual_Completion__c;
        }

        if (activePhaseNumber === 2 || activePhaseNumber === 3) {
            this.phases.phase1.endDate = this.projectDetails.Chamber_of_Commerce_Actual_Completion__c;
            this.phases.phase2.endDate = this.projectDetails.Company_Stamp_Actual_Completion__c;
            this.phases.phase2.startDate = this.projectDetails.Company_Reg_Actual_Completion__c;
        }

        for(let phase in this.phases) {
            let tmpPhase = this.phases[phase];

            if (tmpPhase.order < activePhaseNumber) {
                tmpPhase.classes = `${tmpPhase.classes} striked`;
            }
        }
    }

    getTasksForActiveStage(stageTitle) {
        for(let phase in this.finalStructure) {
            for(let i=0; i < Object.keys(this.finalStructure[phase]).length ; i++) {
                if (stageTitle === this.finalStructure[phase][i].stageTitle) {
                    return this.finalStructure[phase][i].tasks;
                }
            }
        }
    }

    getMarkedTasks(stageTitle, currentTaskTitle) {
        for(let phase in this.finalStructure) {
            for(let i=0; i < Object.keys(this.finalStructure[phase]).length ; i++) {
                if (stageTitle === this.finalStructure[phase][i].stageTitle) {
                    this.finalStructure[phase][i].tasks.forEach((task, idx) => {
                        console.log(task, idx);
                    })
                }
            }
        }
    }
}