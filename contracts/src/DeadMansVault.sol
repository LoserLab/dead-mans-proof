// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//
//    ___  ____  __    ___    __  __    __    _  _  ____
//   (   \( ___)(__\  (   \  (  \/  )  /__\  ( \( )/ ___)
//    ) ) ))__)  /__\  ) ) )  )    (  /(__)\  )  ( \___ \
//   (___/(____)(__)_)(___/  (_/\/\_)(__)(__)(__)\_)(____/
//
//    ____  ____   ___   ___  ____
//   (  _ \(  _ \ / _ \ / _ \( ___)
//    ) __/ )   /( (_) )( (_) ))__)
//   (__)  (_)\_) \___/  \___/(__)
//
//   Your data stays sealed. Only the truth gets out.
//   Built by Loser Labs (@heathenft) for The Synthesis 2026.
//
//   "The dead keep their secrets well,
//    but the truth still finds a way to tell."
//

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

    address public owner;
    address public agent;
    bool public paused;
    uint256 public commitmentCount;
    uint256 public attestationCount;

    uint256 public constant MAX_ATTESTATIONS_PER_COMMITMENT = 1000;

    /// @dev The vault's first words, sealed at genesis.
    string public constant GENESIS_INSCRIPTION = "What is sealed cannot be unseen. What is attested cannot be denied.";

    mapping(bytes32 => DataCommitment) public commitments;
    mapping(bytes32 => Attestation[]) public attestationsByCommitment;

    event CommitmentCreated(bytes32 indexed commitmentId, address indexed depositor, string schemaType, uint256 timestamp);
    event AttestationPublished(bytes32 indexed commitmentId, bytes32 indexed queryHash, bool answer, uint8 confidence, uint256 timestamp);
    event AgentUpdated(address indexed oldAgent, address indexed newAgent);
    event OwnerUpdated(address indexed oldOwner, address indexed newOwner);
    event Paused(address indexed by);
    event Unpaused(address indexed by);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyAgent() {
        require(msg.sender == agent, "Only agent can attest");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor(address _agent) {
        require(_agent != address(0), "Agent cannot be zero address");
        owner = msg.sender;
        agent = _agent;
        emit AgentUpdated(address(0), _agent);
        emit OwnerUpdated(address(0), msg.sender);
    }

    // ================================================================
    //                        ADMIN FUNCTIONS
    // ================================================================

    function setAgent(address _newAgent) external onlyOwner {
        require(_newAgent != address(0), "Agent cannot be zero address");
        address oldAgent = agent;
        agent = _newAgent;
        emit AgentUpdated(oldAgent, _newAgent);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Owner cannot be zero address");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnerUpdated(oldOwner, _newOwner);
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused(msg.sender);
    }

    // ================================================================
    //                        CORE FUNCTIONS
    // ================================================================

    function depositCommitment(bytes32 dataHash, string calldata schemaType) external whenNotPaused returns (bytes32 commitmentId) {
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
    ) external onlyAgent whenNotPaused {
        require(commitments[commitmentId].active, "Commitment not active");
        require(confidence <= 100, "Confidence must be 0-100");
        require(attestationsByCommitment[commitmentId].length < MAX_ATTESTATIONS_PER_COMMITMENT, "Attestation limit reached");

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

    function deactivateCommitment(bytes32 commitmentId) external {
        require(commitments[commitmentId].depositor == msg.sender, "Only depositor can deactivate");
        commitments[commitmentId].active = false;
    }

    // ================================================================
    //                        VIEW FUNCTIONS
    // ================================================================

    function getAttestations(bytes32 commitmentId, uint256 offset, uint256 limit) external view returns (Attestation[] memory) {
        Attestation[] storage all = attestationsByCommitment[commitmentId];
        uint256 total = all.length;

        if (offset >= total) {
            return new Attestation[](0);
        }

        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }

        Attestation[] memory page = new Attestation[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            page[i - offset] = all[i];
        }
        return page;
    }

    function getAttestationCount(bytes32 commitmentId) external view returns (uint256) {
        return attestationsByCommitment[commitmentId].length;
    }

    // ================================================================
    //                        EASTER EGGS
    // ================================================================

    /// @notice The vault remembers.
    function theVaultSpeaks() external pure returns (string memory) {
        return "The dead keep their secrets well, but the truth still finds a way to tell.";
    }

    /// @notice For those who look deeper.
    function loserLabs() external pure returns (string memory) {
        return "Built with love and sleepless nights by Loser Labs. We lose so you can win. Heathen";
    }

    /// @notice 29.
    function theMeaningOfProof() external pure returns (uint256) {
        return 29;
    }
}
