import { LightningElement, api, wire, track } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartJS from '@salesforce/resourceUrl/chartJS';

import { getRecord } from 'lightning/uiRecordApi';
const FIELDS = ['Project_Plan__c.Id', 'Project_Plan__c.Deliverarables_Completed__c',];

export default class Astrolab_pie_chart extends LightningElement {
    @api recordId;

    @track deliverableCompleted

    constructor() {
        super()

        Promise.all([ loadScript(this, chartJS) ])
        .then(() => {
            if (this.deliverableCompleted) {
                this.addChart()
            } else {
                setTimeout(function() {
                    this.addChart()
                }.bind(this), 1000)
            }
        })
        .catch(error => { console.log(error); });
    }

    addChart() {
        let cnv = this.template.querySelector(".astrolabscanvas")
        const ctx = cnv.getContext('2d');

        const chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: {
                labels: ['Deliverables Completed', 'Deliverables to Complete'],
                datasets: [{
                    backgroundColor: ["#1E254A", "#939ED2"],
                    data: [this.deliverableCompleted, 100-this.deliverableCompleted]
                }]
            },

            // Configuration options go here
            options: {
                title: {
                  display: true,
                  text: '% of Project Completion Plan'
                },
                legend: {
                    position: 'bottom'
                },
                // tooltips: {
                //     enabled: false,

                //     custom: function(tooltipModel) {
                //         let tooltipEl = this.template.querySelector(".astrolabscanvas");

                //     }.bind(this)
                // }
              }
        });
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
            console.log(message)
        } else if (data) {
            this.deliverableCompleted = parseInt(data.fields.Deliverarables_Completed__c.value, 10)
        }
    } 
}