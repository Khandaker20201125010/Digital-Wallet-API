import { Types } from "mongoose";

export type TransactionType = "add_money" | "withdraw" | "send" | "cash_in" | "cash_out";

export type TransactionStatus = "pending" | "completed" | "failed" | "reversed";

export interface ITransaction {
  from: Types.ObjectId;                   
  to?: Types.ObjectId;                     
  type: TransactionType;                  
  amount: number;                          
  fee?: number;                            
  status?: TransactionStatus;            
  reference: string;                       
  initiatedBy: Types.ObjectId;             
  initiatedRole: "user" | "agent" | "admin";
  reversedBy?: Types.ObjectId;             
  reversalReason?: string;                 

  createdAt?: Date;
  updatedAt?: Date;
}
