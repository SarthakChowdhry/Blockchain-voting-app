//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Vote{
    event VoteCast(address indexed voter, uint candidateIndex);
    event NewLeader(uint indexed candidateIndex, string name, uint newVoteCount);

    mapping(address => bool) public hasvoted;

    struct Candidate{
        string name;
        uint count;
    }

    Candidate[] public candidates;
    uint public maxVotes;
    uint public winnerIndex;

    constructor(string[] memory names) {
        require(names.length > 0, "No candidates");
        for (uint i = 0; i < names.length; i++) {
            candidates.push(Candidate(names[i], 0));
        }
        winnerIndex = 0;
        maxVotes = 0;
    }

    function cast_vote(uint candidate_index) public {
        require(!hasvoted[msg.sender], "User has already voted");
        require(candidate_index < candidates.length, "Invalid Candidate");

        hasvoted[msg.sender] = true;
        candidates[candidate_index].count++;

        emit VoteCast(msg.sender, candidate_index);
        if (candidates[candidate_index].count > maxVotes) {
            maxVotes = candidates[candidate_index].count;
            winnerIndex = candidate_index;

            emit NewLeader(candidate_index, candidates[candidate_index].name, maxVotes);
        }
    }

    function getCandidatescount() public view returns(uint) {
        return candidates.length;
    }

    function getCandidates() public view returns(Candidate[] memory){
        return candidates;
    }

    function getWinner() public view returns (Candidate memory){
        return candidates[winnerIndex];
    }
}