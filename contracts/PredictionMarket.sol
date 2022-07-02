// SPDX-License-Identifier:MIT

pragma solidity ^0.8.5;

error PredictionMarket__CannotPlaceABet();
error PredictionMarket__NotEnoughETHToPlaceABet();
error PredictionMarket__DidNotPlaceBetOnWinner();
error PredictionMarket__CannotWithdrawBeforeElectionFinishes();
error PredictionMarket__TransferFailed();
error PredictionMarket__OnlyRegisteredOracleAllowedToReturnResults();

contract PredictionMarket {
    address public oracle;
    bool public electionFinished;
    // enum Side {
    //     Trump,
    //     Biden
    // }

    mapping(string => uint256) public bets;
    mapping(address => mapping(string => uint256)) betsPerPerson;

    constructor(address _oracle) {
        oracle = _oracle;
        electionFinished = false;
    }

    string public winner;
    string public looser;

    // Result public result;

    function createBet(string memory _side) external payable {
        if (electionFinished) {
            revert PredictionMarket__CannotPlaceABet();
        }

        if (msg.value <= 0) {
            revert PredictionMarket__NotEnoughETHToPlaceABet();
        }

        bets[_side] += msg.value;
        betsPerPerson[msg.sender][_side] += msg.value;
    }

    function withdrawGain() external {
        uint256 personBet = betsPerPerson[msg.sender][winner];
        if (personBet <= 0) {
            revert PredictionMarket__DidNotPlaceBetOnWinner();
        }

        if (!electionFinished) {
            revert PredictionMarket__CannotWithdrawBeforeElectionFinishes();
        }

        uint256 moneyPersonEarns = ((bets[winner] + bets[looser]) *
            (personBet)) / (bets[winner]);

        betsPerPerson[msg.sender][winner] = 0;
        betsPerPerson[msg.sender][looser] = 0;

        (bool succ, ) = payable(msg.sender).call{value: moneyPersonEarns}("");

        if (!succ) {
            revert PredictionMarket__TransferFailed();
        }
    }

    function reportResultsOfElection(
        string memory _winner,
        string memory _looser
    ) external {
        if (msg.sender != oracle) {
            revert PredictionMarket__OnlyRegisteredOracleAllowedToReturnResults();
        }

        winner = _winner;
        looser = _looser;
        electionFinished = true;
    }

    function getWinner() public view returns (string memory) {
        return winner;
    }

    function getLooser() public view returns (string memory) {
        return looser;
    }
}
