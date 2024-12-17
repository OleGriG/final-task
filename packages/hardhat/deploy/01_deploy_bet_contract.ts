import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Разворачивает контракт с именем "BetContract", используя аккаунт `deployer`.
 * В качестве аргумента конструктора используется адрес аккаунта `deployer`.
 *
 * @param hre Объект HardhatRuntimeEnvironment.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("BetContract", {
    // Аргументы конструктора контракта
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default deployYourContract;
deployYourContract.tags = ["BetContract"];
