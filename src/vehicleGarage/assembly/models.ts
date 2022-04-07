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
  public serviceIds: PersistentSet<VehicleServiceId> = new PersistentSet<VehicleServiceId>(
    "s"
  );
  created_at: Timestamp = context.blockTimestamp;

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
export class VehicleGarage {
  creator: AccountId = context.predecessor;
  created_at: Timestamp = context.blockTimestamp;

  static create_garage(): void {
    const garage = new VehicleGarage();
    this.set_garage(garage);
  }

  static get_garage(): VehicleGarage {
    return storage.getSome<VehicleGarage>(GARAGE_KEY);
  }

  static set_garage(garage: VehicleGarage): void {
    storage.set(GARAGE_KEY, garage);
  }

  // -------------------------------------------
  // Vehicles
  // -------------------------------------------

  static add_vehicle(
    year: string,
    make: string,
    model: string,
    owner: AccountId,
    vehicleNotes: string,
    dateAcquired: string
  ): Vehicle {
    let newVehicle = new Vehicle(
      year,
      make,
      model,
      owner,
      dateAcquired,
      vehicleNotes
    );
    vehicles.set(newVehicle.id, newVehicle);
    return newVehicle;
  }

  static update_vehicle(
    vehicleId: VehicleId,
    year: string,
    make: string,
    model: string,
    owner: AccountId,
    vehicleNotes: string,
    dateAcquired: string
  ): void {
    let currentVehicle = vehicles.get(vehicleId);
    if (currentVehicle !== null) {
      currentVehicle.year = year;
      currentVehicle.make = make;
      currentVehicle.model = model;
      currentVehicle.owner = owner;
      currentVehicle.vehicleNotes = vehicleNotes;
      currentVehicle.dateAcquired = dateAcquired;
      vehicles.set(vehicleId, currentVehicle);
    }
  }

  static delete_service_id_from_vehicle(
    vehicleId: VehicleId,
    vehicleServiceId: VehicleServiceId
  ): void {
    let currentVehicle = vehicles.get(vehicleId);
    if (currentVehicle !== null) {
      let serviceIds = currentVehicle.serviceIds;
      serviceIds.delete(vehicleServiceId);
      vehicles.set(vehicleId, currentVehicle);
    }
  }

  static delete_vehicle(vehicleId: VehicleId): void {
    // grab all service ids
    let currentVehicle = vehicles.get(vehicleId);

    if (currentVehicle !== null) {
      let vehicleServiceIds = currentVehicle.serviceIds.values();
      // delete all services from vehicle
      if (vehicleServiceIds.length) {
        for (let i = 0; i < vehicleServiceIds.length; ++i) {
          VehicleGarage.delete_vehicle_service(vehicleServiceIds[i]);
        }
      }
    }

    // delete vehicle
    vehicles.delete(vehicleId);
  }

  // -------------------------------------------
  // Vehicle Services
  // -------------------------------------------

  static add_vehicle_service(
    vehicleId: VehicleId,
    serviceDate: string,
    serviceNotes: string
  ): void {
    let newVehicleService = new VehicleService(
      vehicleId,
      serviceDate,
      serviceNotes
    );
    vehicleService.set(newVehicleService.id, newVehicleService);
    VehicleGarage.add_service_id(vehicleId, newVehicleService.id);
  }

  static add_service_id(
    vehicleId: VehicleId,
    vehicleServiceId: VehicleServiceId
  ): void {
    let currentVehicle = vehicles.get(vehicleId);
    if (currentVehicle !== null) {
      currentVehicle.serviceIds.add(vehicleServiceId);
      vehicles.set(vehicleId, currentVehicle);
    }
  }

  static update_vehicle_service(
    vehicleServiceId: VehicleServiceId,
    vehicleId: VehicleId,
    serviceDate: string,
    serviceNotes: string
  ): void {
    let currentVehicleService = vehicleService.get(vehicleServiceId);
    if (currentVehicleService !== null) {
      currentVehicleService.vehicleId = vehicleId;
      currentVehicleService.serviceDate = serviceDate;
      currentVehicleService.serviceNotes = serviceNotes;
      vehicleService.set(vehicleServiceId, currentVehicleService);
    }
  }

  static delete_vehicle_service(vehicleServiceId: VehicleServiceId): void {
    let currentVehicleService = vehicleService.get(vehicleServiceId);
    if (currentVehicleService !== null) {
      let currentVehicleId = currentVehicleService.vehicleId;
      VehicleGarage.delete_service_id_from_vehicle(
        currentVehicleId,
        vehicleServiceId
      );
    }
    vehicleService.delete(vehicleServiceId);
  }
}

export const vehicles = new PersistentMap<VehicleId, Vehicle>("v");
export const vehicleService = new PersistentMap<
  VehicleServiceId,
  VehicleService
>("vs");
