export type Artist = {id?:string;name:string};
export type MenuItem = {id?:string; label:string;icon?:React.FC;action:(ids?:string[])=>void};
export type AnalyticsData = {category:string;label:string};
export type Track = {id:string;name:string;artists:Artist[];support?:{id?:string;name:string}|string;supportName?:string;duration?:number;image?:string;updatedAt?:number;createdBy?:string;position?:number;hubs?:unknown[];hubImg?:string;additionalHubs?:number;isDeleted?:boolean};
