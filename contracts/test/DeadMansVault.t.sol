// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DeadMansVault.sol";

contract DeadMansVaultTest is Test {
    DeadMansVault public vault;
    address public deployer = address(this);
    address public agent = address(0xA6E);
    address public depositor = address(0xDE9);
    address public querier = address(0xC0E);
    address public newAgent = address(0xA6F);
    address public newOwner = address(0x0EE);

    function setUp() public {
        vault = new DeadMansVault(agent);
    }

    // --- Constructor ---

    function test_constructor() public view {
        assertEq(vault.agent(), agent);
        assertEq(vault.owner(), deployer);
        assertEq(vault.commitmentCount(), 0);
        assertEq(vault.attestationCount(), 0);
        assertFalse(vault.paused());
    }

    function test_zeroAddressReverts() public {
        vm.expectRevert("Agent cannot be zero address");
        new DeadMansVault(address(0));
    }

    // --- Deposit ---

    function test_depositCommitment() public {
        bytes32 dataHash = keccak256("private resume data");

        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        (bytes32 storedHash, address storedDepositor, uint256 timestamp, string memory schemaType, bool active) = vault.commitments(commitmentId);

        assertEq(storedHash, dataHash);
        assertEq(storedDepositor, depositor);
        assertGt(timestamp, 0);
        assertEq(schemaType, "resume");
        assertTrue(active);
        assertEq(vault.commitmentCount(), 1);
    }

    // --- Attestations ---

    function test_publishAttestation() public {
        bytes32 dataHash = keccak256("private data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "financial");

        bytes32 queryHash = keccak256("Is balance above 10000?");

        vm.prank(agent);
        vault.publishAttestation(commitmentId, queryHash, true, 95, "ipfs://reasoning");

        DeadMansVault.Attestation[] memory attestations = vault.getAttestations(commitmentId, 0, 100);
        assertEq(attestations.length, 1);
        assertEq(attestations[0].answer, true);
        assertEq(attestations[0].confidence, 95);
        assertEq(vault.attestationCount(), 1);
    }

    function test_onlyAgentCanAttest() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.prank(querier);
        vm.expectRevert("Only agent can attest");
        vault.publishAttestation(commitmentId, keccak256("query"), true, 90, "uri");
    }

    function test_cannotAttestInactiveCommitment() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "calendar");

        vm.prank(depositor);
        vault.deactivateCommitment(commitmentId);

        vm.prank(agent);
        vm.expectRevert("Commitment not active");
        vault.publishAttestation(commitmentId, keccak256("q"), true, 50, "uri");
    }

    function test_confidenceBounds() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.prank(agent);
        vm.expectRevert("Confidence must be 0-100");
        vault.publishAttestation(commitmentId, keccak256("q"), true, 101, "uri");
    }

    function test_multipleAttestations() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.startPrank(agent);
        vault.publishAttestation(commitmentId, keccak256("q1"), true, 95, "uri1");
        vault.publishAttestation(commitmentId, keccak256("q2"), false, 80, "uri2");
        vault.publishAttestation(commitmentId, keccak256("q3"), true, 60, "uri3");
        vm.stopPrank();

        assertEq(vault.getAttestationCount(commitmentId), 3);
        assertEq(vault.attestationCount(), 3);
    }

    // --- Deactivation ---

    function test_onlyDepositorCanDeactivate() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.prank(querier);
        vm.expectRevert("Only depositor can deactivate");
        vault.deactivateCommitment(commitmentId);
    }

    // --- Agent Rotation ---

    function test_setAgent() public {
        vault.setAgent(newAgent);
        assertEq(vault.agent(), newAgent);
    }

    function test_setAgentOnlyOwner() public {
        vm.prank(querier);
        vm.expectRevert("Only owner");
        vault.setAgent(newAgent);
    }

    function test_setAgentZeroAddress() public {
        vm.expectRevert("Agent cannot be zero address");
        vault.setAgent(address(0));
    }

    function test_setAgentEmitsEvent() public {
        vm.expectEmit(true, true, false, false);
        emit DeadMansVault.AgentUpdated(agent, newAgent);
        vault.setAgent(newAgent);
    }

    function test_newAgentCanAttest() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vault.setAgent(newAgent);

        vm.prank(newAgent);
        vault.publishAttestation(commitmentId, keccak256("q"), true, 90, "uri");

        assertEq(vault.getAttestationCount(commitmentId), 1);
    }

    function test_oldAgentCannotAttestAfterRotation() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vault.setAgent(newAgent);

        vm.prank(agent);
        vm.expectRevert("Only agent can attest");
        vault.publishAttestation(commitmentId, keccak256("q"), true, 90, "uri");
    }

    // --- Ownership ---

    function test_transferOwnership() public {
        vault.transferOwnership(newOwner);
        assertEq(vault.owner(), newOwner);
    }

    function test_transferOwnershipOnlyOwner() public {
        vm.prank(querier);
        vm.expectRevert("Only owner");
        vault.transferOwnership(newOwner);
    }

    function test_transferOwnershipZeroAddress() public {
        vm.expectRevert("Owner cannot be zero address");
        vault.transferOwnership(address(0));
    }

    function test_newOwnerCanSetAgent() public {
        vault.transferOwnership(newOwner);

        vm.prank(newOwner);
        vault.setAgent(newAgent);
        assertEq(vault.agent(), newAgent);
    }

    function test_oldOwnerCannotActAfterTransfer() public {
        vault.transferOwnership(newOwner);

        vm.expectRevert("Only owner");
        vault.setAgent(newAgent);
    }

    // --- Pause ---

    function test_pause() public {
        vault.pause();
        assertTrue(vault.paused());
    }

    function test_unpause() public {
        vault.pause();
        vault.unpause();
        assertFalse(vault.paused());
    }

    function test_pauseOnlyOwner() public {
        vm.prank(querier);
        vm.expectRevert("Only owner");
        vault.pause();
    }

    function test_unpauseOnlyOwner() public {
        vault.pause();

        vm.prank(querier);
        vm.expectRevert("Only owner");
        vault.unpause();
    }

    function test_cannotDepositWhenPaused() public {
        vault.pause();

        vm.prank(depositor);
        vm.expectRevert("Contract is paused");
        vault.depositCommitment(keccak256("data"), "resume");
    }

    function test_cannotAttestWhenPaused() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vault.pause();

        vm.prank(agent);
        vm.expectRevert("Contract is paused");
        vault.publishAttestation(commitmentId, keccak256("q"), true, 90, "uri");
    }

    function test_canDeactivateWhenPaused() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vault.pause();

        vm.prank(depositor);
        vault.deactivateCommitment(commitmentId);
    }

    function test_canReadWhenPaused() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.prank(agent);
        vault.publishAttestation(commitmentId, keccak256("q"), true, 90, "uri");

        vault.pause();

        assertEq(vault.getAttestationCount(commitmentId), 1);
        DeadMansVault.Attestation[] memory attestations = vault.getAttestations(commitmentId, 0, 100);
        assertEq(attestations.length, 1);
    }

    // --- Pagination ---

    function test_getAttestationsPaginated() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.startPrank(agent);
        for (uint256 i = 0; i < 5; i++) {
            vault.publishAttestation(commitmentId, keccak256(abi.encodePacked(i)), true, uint8(90 + i), "uri");
        }
        vm.stopPrank();

        DeadMansVault.Attestation[] memory page1 = vault.getAttestations(commitmentId, 0, 2);
        assertEq(page1.length, 2);
        assertEq(page1[0].confidence, 90);
        assertEq(page1[1].confidence, 91);

        DeadMansVault.Attestation[] memory page2 = vault.getAttestations(commitmentId, 2, 2);
        assertEq(page2.length, 2);
        assertEq(page2[0].confidence, 92);
        assertEq(page2[1].confidence, 93);

        DeadMansVault.Attestation[] memory page3 = vault.getAttestations(commitmentId, 4, 2);
        assertEq(page3.length, 1);
        assertEq(page3[0].confidence, 94);
    }

    function test_getAttestationsOffsetBeyondLength() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        DeadMansVault.Attestation[] memory result = vault.getAttestations(commitmentId, 100, 10);
        assertEq(result.length, 0);
    }

    // --- Attestation Cap ---

    function test_attestationCapEnforced() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.startPrank(agent);
        for (uint256 i = 0; i < 1000; i++) {
            vault.publishAttestation(commitmentId, keccak256(abi.encodePacked(i)), true, 90, "uri");
        }

        vm.expectRevert("Attestation limit reached");
        vault.publishAttestation(commitmentId, keccak256("overflow"), true, 90, "uri");
        vm.stopPrank();
    }
}
