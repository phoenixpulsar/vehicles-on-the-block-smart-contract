import { context, storage, PersistentMap, PersistentSet } from "near-sdk-as";
import {
  VehicleId,
  VehicleServiceId,
  AccountId,
  Timestamp,
  idCreator,
  GARAGE_KEY,
} from "../../utils";

@nearBindgen
export class Vehicle {}
@nearBindgen
export class VehicleService {}
@nearBindgen
export class VehicleGarage {}
