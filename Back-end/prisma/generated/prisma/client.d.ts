import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Basemodels
 * const basemodels = await prisma.basemodel.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Basemodel
 *
 */
export type Basemodel = Prisma.BasemodelModel;
/**
 * Model Company
 *
 */
export type Company = Prisma.CompanyModel;
/**
 * Model Users
 *
 */
export type Users = Prisma.UsersModel;
/**
 * Model Worker
 *
 */
export type Worker = Prisma.WorkerModel;
/**
 * Model Job
 *
 */
export type Job = Prisma.JobModel;
/**
 * Model JobOffer
 *
 */
export type JobOffer = Prisma.JobOfferModel;
/**
 * Model Review
 *
 */
export type Review = Prisma.ReviewModel;
/**
 * Model Message
 *
 */
export type Message = Prisma.MessageModel;
//# sourceMappingURL=client.d.ts.map