import { LightningElement, api, track } from 'lwc';

export default class Task_in_stage extends LightningElement {
    @api tasks;
    @api taskInStage;
    @api taskInLoop;
}