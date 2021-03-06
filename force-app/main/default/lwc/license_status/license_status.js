import { LightningElement, track } from 'lwc';
import userId from '@salesforce/user/Id';
import getProjectPlanByUserId from '@salesforce/apex/ProjectPlan.getProjectPlanByUserId';
import getDependencyMap from '@salesforce/apex/DependencyExtraction.getDependencyMap';

export default class License_status extends LightningElement {
    @track phases = {
        phase1: {
            order: 1,
            title: 'Establishing a Legal Entity',
            isActive: true,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
            stages: [],
        },
        phase2: {
            order: 2,
            title: 'Portals Registration & GM Visa',
            isActive: false,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
            stages: [],
        },
        phase3: {
            order: 3,
            title: 'Residency & Setup Finalisation',
            isActive: false,
            classes: 'phase-box',
            startDate: null,
            endDate: null,
            stages: [],
        }
    };

    @track companyName = '';

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
            this.companyName = this.projectDetails.Account__r.Name;
            this.processResponseData();
        })
        .catch(err => {
            console.log('you don\'t have any project');
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

                this.phases[`phase${activePhaseNumber}`].stages 
                    = this.getMarkedStages(this.projectDetails.Project_Phase__c, this.projectDetails.Project_Stage__c, false);

                state.isActive = true;
                state.classes = 'phase-box active-phase';
            } else {
                state.isActive = false;
            }
        }
        
        //generate start and end dates
        const currentStage = this.stages[this.projectDetails.Project_Stage__c];
        try {
            this.phases[`phase${activePhaseNumber}`].endDate = this.projectDetails[currentStage[0]];
        
            if (activePhaseNumber === currentStage[1]) {
                const prevFieldName = this.mapProjectedStartDate2ActualEndPrev[currentStage[0]];
                this.phases[`phase${activePhaseNumber}`].startDate = this.projectDetails[prevFieldName];
            }

        } catch(err) {
            // console.log(err);
        }
        try {
            this.phases.phase1.startDate = this.projectDetails.Project_Start_Date__c;
            this.phases.phase3.endDate = this.projectDetails.Handover_Projected_Completion__c;
        } catch(err) {
            //do nothing. we don't care and will not display the date
        }

        if (activePhaseNumber === 1) {
            this.phases['phase2'].stages = this.getMarkedStages('Portals Registration & GM Visa', '', true);
            this.phases['phase3'].stages = this.getMarkedStages('Residency & Setup Finalisation', '', true);
        }

        if (activePhaseNumber === 2) {
            this.phases.phase1.endDate = this.projectDetails.Chamber_of_Commerce_Actual_Completion__c;
            this.phases['phase1'].stages = this.getMarkedStages('Establishing a Legal Entity', '', false);
            this.phases['phase3'].stages = this.getMarkedStages('Residency & Setup Finalisation', '', true);
        }

        if (activePhaseNumber === 3) {
            this.phases['phase1'].stages = this.getMarkedStages('Establishing a Legal Entity', '', false);
            this.phases['phase2'].stages = this.getMarkedStages('Portals Registration & GM Visa', '', false);
        }

        if (activePhaseNumber === 2 || activePhaseNumber === 3) {
            this.phases.phase1.endDate = this.projectDetails.Chamber_of_Commerce_Actual_Completion__c;
            this.phases.phase2.endDate = this.projectDetails.Company_Stamp_Actual_Completion__c;
            this.phases.phase2.startDate = this.projectDetails.Company_Reg_Actual_Completion__c;
        }

        for(let phase in this.phases) {
            let tmpPhase = this.phases[phase];
            
            if (tmpPhase.order < activePhaseNumber) {
                let cl = '';
                switch(tmpPhase.order) {
                    case 1:
                        cl = 'greyed';
                        break;
                    case 2: 
                        cl = 'greyed2';
                        break;
                    case 3:
                        cl = 'greyed3';
                        break;
                }

                tmpPhase.classes = `${tmpPhase.classes} ` + cl;

            }
        }
    }

    getMarkedStages(phaseTitle, currentStage, isFuture=false) {
        let stages = [];
        for(let phase in this.finalStructure) {
            if (phase === phaseTitle) {
                let border = -1;
                let stageClasses = '';
                
                for(let i=0; i < Object.keys(this.finalStructure[phase]).length; i++) {
                    if (!isFuture) {
                        if (this.finalStructure[phase][i].stageTitle === currentStage) {
                            border = i;
                        }
                        
                        if (i > border && border !== -1) {
                            stageClasses = 'future';
                        } else if (i === border) {
                            stageClasses = 'active';
                        } else {
                            stageClasses = 'striked';
                        }
                    } else {
                        stageClasses = 'future';
                        
                    }

                    stages[i] = {
                        'title': this.finalStructure[phase][i].stageTitle,
                        'classes': stageClasses,
                    };
                    // console.log(this.finalStructure[phase][i])
                }

                return stages;
            }
        }
    }
}