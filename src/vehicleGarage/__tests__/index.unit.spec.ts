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

const vehicles = (): PersistentMap<util.VehicleId, model.Vehicle> => {
  return new PersistentMap<util.VehicleId, model.Vehicle>("v");
};

const vehiclesServices = (): PersistentMap<
  util.VehicleId,
  model.VehicleService
> => {
  return new PersistentMap<util.VehicleId, model.VehicleService>("vs");
};

/**
 * == UNIT TESTS ==============================================================
 */

describe("vehicleGarage initialization", () => {
  beforeEach(useVehicleGarageAsPredecessor);

  it("creates a new vehicleGarage", () => {
    contract.init();
    const vg = contract.get_vehicle_garage();

    expect(vg.creator).toBe(VEHICLE_GARAGE_ACCOUNT_ID);
  });
});
