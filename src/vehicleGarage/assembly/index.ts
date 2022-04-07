import { storage } from "near-sdk-as";
import {
  VehicleId,
  VehicleServiceId,
  AccountId,
  GARAGE_KEY,
} from "../../utils";
import { Vehicle, VehicleGarage } from "./models";

export function init(): void {
  VehicleGarage.create_garage();
}
export function get_vehicle_garage(): VehicleGarage {
  assert_contract_is_initialized();
  return VehicleGarage.get_garage();
}
export function add_vehicle(
  year: string,
  make: string,
  model: string,
  owner: AccountId,
  vehicleNotes: string,
  dateAcquired: string
): Vehicle {
  assert_contract_is_initialized();
  return VehicleGarage.add_vehicle(
    year,
    make,
    model,
    owner,
    vehicleNotes,
    dateAcquired
  );
}
export function update_vehicle(
  vehicleId: VehicleId,
  year: string,
  make: string,
  model: string,
  owner: AccountId,
  vehicleNotes: string,
  dateAcquired: string
): void {
  assert_contract_is_initialized();
  VehicleGarage.update_vehicle(
    vehicleId,
    year,
    make,
    model,
    owner,
    vehicleNotes,
    dateAcquired
  );
}
export function delete_vehicle(vehicleId: VehicleId): void {
  assert_contract_is_initialized();
  VehicleGarage.delete_vehicle(vehicleId);
}
export function add_vehicle_service(
  vehicleId: VehicleId,
  serviceDate: string,
  serviceNotes: string
): void {
  assert_contract_is_initialized();
  VehicleGarage.add_vehicle_service(vehicleId, serviceDate, serviceNotes);
}
export function update_vehicle_service(
  vehicleServiceId: VehicleServiceId,
  vehicleId: VehicleId,
  serviceDate: string,
  serviceNotes: string
): void {
  assert_contract_is_initialized();
  VehicleGarage.update_vehicle_service(
    vehicleServiceId,
    vehicleId,
    serviceDate,
    serviceNotes
  );
}
export function delete_vehicle_service(
  vehicleServiceId: VehicleServiceId
): void {
  assert_contract_is_initialized();
  VehicleGarage.delete_vehicle_service(vehicleServiceId);
}

function is_initialized(): bool {
  return storage.hasKey(GARAGE_KEY);
}
function assert_contract_is_initialized(): void {
  assert(is_initialized(), "Contract must be initialized first.");
}
