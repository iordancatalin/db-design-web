import { Notification } from "../data-model/notification";

export class NotificationWrapper {
    constructor(public id: string, public notification: Notification) { }
}