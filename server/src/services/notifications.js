import Notification from '../models/Notification.js'; export const notify=(user,type,title,message,link='')=>Notification.create({user,type,title,message,link});
