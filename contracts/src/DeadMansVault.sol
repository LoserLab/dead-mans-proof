// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title DeadMansVault
/// @notice Privacy-preserving attestation vault. Stores cryptographic commitments
///         of sealed data and agent-verified attestations onchain.
/// @dev Part of Dead Man's Proof by Loser Labs (https://dead-mans-proof.vercel.app)
contract DeadMansVault {

    struct DataCommitment {
        bytes32 dataHash;
        address depositor;
        uint256 timestamp;
        string schemaType;
        bool active;
    }

    struct Attestation {
        bytes32 commitmentId;
        bytes32 queryHash;
        bool answer;
        uint8 confidence;
        string reasoningURI;
        uint256 timestamp;
    }

    address public agent;
    uint256 public commitmentCount;
    uint256 public attestationCount;

    mapping(bytes32 => DataCommitment) public commitments;
    mapping(bytes32 => Attestation[]) public attestationsByCommitment;

    event CommitmentCreated(bytes32 indexed commitmentId, address indexed depositor, string schemaType, uint256 timestamp);
    event AttestationPublished(bytes32 indexed commitmentId, bytes32 indexed queryHash, bool answer, uint8 confidence, uint256 timestamp);
    event AgentUpdated(address indexed oldAgent, address indexed newAgent);

    modifier onlyAgent() {
        require(msg.sender == agent, "Only agent can attest");
        _;
    }

    constructor(address _agent) {
        require(_agent != address(0), "Agent cannot be zero address");
        agent = _agent;
        emit AgentUpdated(address(0), _agent);
    }

    function depositCommitment(bytes32 dataHash, string calldata schemaType) external returns (bytes32 commitmentId) {
        commitmentId = keccak256(abi.encodePacked(dataHash, msg.sender, block.timestamp, commitmentCount));

        commitments[commitmentId] = DataCommitment({
            dataHash: dataHash,
            depositor: msg.sender,
            timestamp: block.timestamp,
            schemaType: schemaType,
            active: true
        });

        commitmentCount++;

        emit CommitmentCreated(commitmentId, msg.sender, schemaType, block.timestamp);
    }

    function publishAttestation(
        bytes32 commitmentId,
        bytes32 queryHash,
        bool answer,
        uint8 confidence,
        string calldata reasoningURI
    ) external onlyAgent {
        require(commitments[commitmentId].active, "Commitment not active");
        require(confidence <= 100, "Confidence must be 0-100");

        attestationsByCommitment[commitmentId].push(Attestation({
            commitmentId: commitmentId,
            queryHash: queryHash,
            answer: answer,
            confidence: confidence,
            reasoningURI: reasoningURI,
            timestamp: block.timestamp
        }));

        attestationCount++;

        emit AttestationPublished(commitmentId, queryHash, answer, confidence, block.timestamp);
    }

    function getAttestations(bytes32 commitmentId) external view returns (Attestation[] memory) {
        return attestationsByCommitment[commitmentId];
    }

    function getAttestationCount(bytes32 commitmentId) external view returns (uint256) {
        return attestationsByCommitment[commitmentId].length;
    }

    function deactivateCommitment(bytes32 commitmentId) external {
        require(commitments[commitmentId].depositor == msg.sender, "Only depositor can deactivate");
        commitments[commitmentId].active = false;
    }
}
