import { VMContext, PersistentMap } from "near-sdk-as";
import * as model from "../assembly/models";
import * as util from "../../utils";
import * as contract from "../assembly";

/**
 * == CONFIG VALUES ============================================================
 */
const VEHICLE_GARAGE_ACCOUNT_ID = "vehicleGarage";

/**
 * == HELPER FUNCTIONS =========================================================
 */
const useVehicleGarageAsPredecessor = (): void => {
  VMContext.setPredecessor_account_id(VEHICLE_GARAGE_ACCOUNT_ID);
};

const doInitialize = (): void => {
  useVehicleGarageAsPredecessor();
  contract.init();
};

/**
 * == UNIT TESTS ==============================================================
 */

describe("vehicleGarage", () => {
  beforeEach(doInitialize);

  it("creates a vehicleGarage", () => {
    const vg = contract.get_vehicle_garage();
    expect(vg.creator).toBe(VEHICLE_GARAGE_ACCOUNT_ID);
  });

  it("creates a new vehicle", () => {
    const newVehicle = contract.add_vehicle(
      "2015",
      "mini",
      "countryman",
      "phoenixpulsar.testnet",
      "new",
      "20150101"
    );

    expect(model.vehicles.get(newVehicle.id)).toStrictEqual(newVehicle);
  });

  it("creates a new vehicle and adds a service", () => {
    const newVehicle = contract.add_vehicle(
      "2018",
      "ford",
      "f-150",
      "phoenixpulsar.testnet",
      "new",
      "20180101"
    );

    const newService = contract.add_vehicle_service(
      newVehicle.id,
      "2019",
      "change oil"
    );

    let newVehicleWithService = model.vehicles.get(newVehicle.id);
    if (newVehicleWithService !== null) {
      expect(newVehicleWithService.serviceIds.has(newService.id));
    }
    expect(model.vehicleService.get(newService.id)).toStrictEqual(newService);
  });

  it("updates a vehicle", () => {
    const newVehicle = contract.add_vehicle(
      "2018",
      "ford",
      "f-150",
      "phoenixpulsar.testnet",
      "new",
      "20180101"
    );

    contract.update_vehicle(
      newVehicle.id,
      "2017",
      "Ford",
      "F-150",
      "tester.testnet",
      "NEW",
      "20170101"
    );
    let updatedVehicle = model.vehicles.get(newVehicle.id);
    if (updatedVehicle !== null) {
      expect(updatedVehicle.year).toBe("2017");
      expect(updatedVehicle.model).toBe("F-150");
      expect(updatedVehicle.make).toBe("Ford");
      expect(updatedVehicle.vehicleNotes).toBe("NEW");
      expect(updatedVehicle.dateAcquired).toBe("20170101");
    }
  });

  it("deletes a vehicle", () => {
    const newVehicle = contract.add_vehicle(
      "2018",
      "ford",
      "f-150",
      "phoenixpulsar.testnet",
      "new",
      "20180101"
    );

    contract.delete_vehicle(newVehicle.id);
    expect(model.vehicles.contains(newVehicle.id)).toBeFalsy();
  });

  it("updates a service", () => {
    const newVehicle = contract.add_vehicle(
      "2018",
      "ford",
      "f-150",
      "phoenixpulsar.testnet",
      "new",
      "20180101"
    );

    const newService = contract.add_vehicle_service(
      newVehicle.id,
      "2019",
      "change oil"
    );

    contract.update_vehicle_service(
      newService.id,
      newVehicle.id,
      "2020",
      "Change Oil and Filter"
    );
    let updatedService = model.vehicleService.get(newService.id);
    if (updatedService !== null) {
      expect(updatedService.serviceDate).toBe("2020");
      expect(updatedService.serviceNotes).toBe("Change Oil and Filter");
    }
  });

  it("deletes a service", () => {
    const newVehicle = contract.add_vehicle(
      "2018",
      "ford",
      "f-150",
      "phoenixpulsar.testnet",
      "new",
      "20180101"
    );

    const newService = contract.add_vehicle_service(
      newVehicle.id,
      "2019",
      "change oil"
    );

    contract.delete_vehicle_service(newService.id);
    expect(model.vehicleService.contains(newService.id)).toBeFalsy();
  });
});
