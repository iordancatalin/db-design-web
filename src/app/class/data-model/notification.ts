export class Notification {
    constructor(public sender: string,
        public receiver: string,
        public diagramId: string,
        public diagramName: string,
        public viewed: boolean = false,
        public date: Date = new Date()) { }
}