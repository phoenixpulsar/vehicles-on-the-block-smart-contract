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
export class Vehicle {
  public id: VehicleId = idCreator();
  created_at: Timestamp = context.blockTimestamp;
  public serviceIds: PersistentSet<VehicleServiceId> = new PersistentSet<VehicleServiceId>(
    "s"
  );

  constructor(
    public year: string,
    public make: string,
    public model: string,
    public owner: AccountId,
    public vehicleNotes: string,
    public dateAcquired: string
  ) {}
}

@nearBindgen
export class VehicleService {
  public id: VehicleServiceId = idCreator();
  created_at: Timestamp = context.blockTimestamp;

  constructor(
    public vehicleId: VehicleId,
    public serviceDate: string,
    public serviceNotes: string
  ) {}
}

@nearBindgen
export class VehicleGarage {}

const vehicles = new PersistentMap<VehicleId, Vehicle>("v");
const vehicleService = new PersistentMap<VehicleServiceId, VehicleService>(
  "vs"
);
