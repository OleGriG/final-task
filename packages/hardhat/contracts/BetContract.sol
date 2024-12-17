// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title BetContract
/// @notice Этот контракт позволяет пользователям создавать, принимать и разрешать пари.
/// @dev Все функции проверяются на соответствие условиям и статусу пари.
contract BetContract {
    // Возможные статусы пари
    enum BetStatus { Open, Accepted, Resolved, Cancelled }

    // Структура, представляющая одно пари
    struct Bet {
        address creator;      // Создатель пари
        address taker;        // Тот, кто принимает пари
        uint256 amount;       // Сумма ставки (в wei)
        string condition;     // Условие пари
        address winner;       // Победитель пари
        BetStatus status;     // Текущий статус пари
    }

    // Массив всех созданных пари
    Bet[] public bets;

    // Событие, вызываемое при создании нового пари
    event BetCreated(uint256 betId, address creator, uint256 amount, string condition);

    // Событие, вызываемое при принятии пари
    event BetAccepted(uint256 betId, address taker);

    // Событие, вызываемое при разрешении пари
    event BetResolved(uint256 betId, address winner);

    // Событие, вызываемое при отмене пари
    event BetCancelled(uint256 betId);

    /// @notice Создать новое пари с указанным условием.
    /// @param condition Условие пари, описанное в виде строки.
    /// @dev Средства отправляются вместе с вызовом функции (msg.value).
    function createBet(string calldata condition) external payable {
        require(msg.value > 0, "Bet amount must be greater than zero");

        // Создаем новое пари и добавляем его в массив
        bets.push(Bet({
            creator: msg.sender,
            taker: address(0),
            amount: msg.value,
            condition: condition,
            winner: address(0),
            status: BetStatus.Open
        }));

        // Вызываем событие для уведомления о создании пари
        emit BetCreated(bets.length - 1, msg.sender, msg.value, condition);
    }

    /// @notice Получение всех пари
    function getBets() external view returns (Bet[] memory) {
        return bets;
    }

    /// @notice Принять пари, указав его ID.
    /// @param betId ID пари, которое нужно принять.
    /// @dev Требуется отправить такую же сумму, что указана в пари.
    function acceptBet(uint256 betId) external payable {
        Bet storage bet = bets[betId];
        require(bet.status == BetStatus.Open, "Bet is not open");
        require(msg.value == bet.amount, "Bet amount mismatch");

        // Обновляем информацию о пари
        bet.taker = msg.sender;
        bet.status = BetStatus.Accepted;

        // Вызываем событие для уведомления о принятии пари
        emit BetAccepted(betId, msg.sender);
    }

    /// @notice Разрешить пари и назначить победителя.
    /// @param betId ID пари, которое нужно разрешить.
    /// @param winner Адрес победителя (creator или taker).
    /// @dev Только участники пари могут вызвать эту функцию.
    function resolveBet(uint256 betId, address winner) external {
        Bet storage bet = bets[betId];
        require(bet.status == BetStatus.Accepted, "Bet is not accepted");
        require(msg.sender == bet.creator, "Only creator can resolve");
        require(winner == bet.creator || winner == bet.taker, "Invalid winner address");

        // Обновляем статус и назначаем победителя
        bet.winner = winner;
        bet.status = BetStatus.Resolved;

        // Переводим средства победителю
        payable(winner).transfer(bet.amount * 2);

        // Вызываем событие для уведомления о разрешении пари
        emit BetResolved(betId, winner);
    }

    /// @notice Отменить пари.
    /// @param betId ID пари, которое нужно отменить.
    /// @dev Только создатель пари может его отменить.
    function cancelBet(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(bet.status == BetStatus.Open, "Bet is not open");
        require(msg.sender == bet.creator, "Only creator can cancel the bet");

        // Обновляем статус и возвращаем средства создателю
        bet.status = BetStatus.Cancelled;
        payable(bet.creator).transfer(bet.amount);

        // Вызываем событие для уведомления об отмене пари
        emit BetCancelled(betId);
    }
}
