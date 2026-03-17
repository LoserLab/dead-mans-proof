// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/DeadMansVault.sol";

contract DeployScript is Script {
    function run() external {
        address agent = vm.envAddress("AGENT_ADDRESS");

        vm.startBroadcast();
        DeadMansVault vault = new DeadMansVault(agent);
        vm.stopBroadcast();

        console.log("DeadMansVault deployed to:", address(vault));
        console.log("Agent address:", agent);
    }
}
