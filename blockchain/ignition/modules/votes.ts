import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("Vote_Contract", (m) => {

    const canditates:string[] = ["Sarthak", "Arrnav"];

    const contract = m.contract("Vote", [canditates]);
    

    return {contract};
})