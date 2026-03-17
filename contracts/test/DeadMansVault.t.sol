// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/DeadMansVault.sol";

contract DeadMansVaultTest is Test {
    DeadMansVault public vault;
    address public agent = address(0xA6E);
    address public depositor = address(0xDE9);
    address public querier = address(0xC0E);

    function setUp() public {
        vault = new DeadMansVault(agent);
    }

    function test_constructor() public view {
        assertEq(vault.agent(), agent);
        assertEq(vault.commitmentCount(), 0);
        assertEq(vault.attestationCount(), 0);
    }

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

    function test_publishAttestation() public {
        bytes32 dataHash = keccak256("private data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "financial");

        bytes32 queryHash = keccak256("Is balance above 10000?");

        vm.prank(agent);
        vault.publishAttestation(commitmentId, queryHash, true, 95, "ipfs://reasoning");

        DeadMansVault.Attestation[] memory attestations = vault.getAttestations(commitmentId);
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

    function test_onlyDepositorCanDeactivate() public {
        bytes32 dataHash = keccak256("data");
        vm.prank(depositor);
        bytes32 commitmentId = vault.depositCommitment(dataHash, "resume");

        vm.prank(querier);
        vm.expectRevert("Only depositor can deactivate");
        vault.deactivateCommitment(commitmentId);
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

    function test_zeroAddressReverts() public {
        vm.expectRevert("Agent cannot be zero address");
        new DeadMansVault(address(0));
    }
}
