export interface ITasks  {
    id:string;
    name:string;
    description:string;
    status:"Pending" | "Completed";
    dueDate?:number;
}
