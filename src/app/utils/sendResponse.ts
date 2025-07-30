import { Response } from "express";

interface TMeta {
  total: number;
}

interface TResponseData<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data?: T;
  meta?: TMeta;
}

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
