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

describe("vehicleGarage initialization", () => {
  beforeEach(doInitialize);

  it("creates a new vehicleGarage", () => {
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
});
