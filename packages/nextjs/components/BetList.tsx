import React, { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Bet {
  creator: string; // Создатель пари
  taker: string; // Тот, кто принял пари
  amount: bigint; // Сумма пари
  condition: string; // Условие пари
  winner: string; // Тот, кто выиграл пари
  status: number; // Текущий статус пари
}

/**
 * Компонент для отображения списка всех пари.
 * Использует функцию bets из смарт-контракта для получения данных.
 */
const BetList: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]); // Локальное состояние для хранения списка пари
  const { data: betsData } = useScaffoldReadContract({
    contractName: "BetContract",
    functionName: "getBets",
  });
  console.log(bets);

  /**
   * Обновление локального состояния при изменении данных из контракта.
   */
  useEffect(() => {
    if (betsData) {
      setBets(betsData as unknown as Bet[]);
    }
  }, [betsData]);

  return (
    <div className="p-4 border rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Список пари</h2>
      {bets.length > 0 ? (
        <ul>
          {bets.map((bet, index) => (
            <li key={index} className="mb-4 border-b pb-2">
              <p>
                <strong>Условие:</strong> {bet.condition}
              </p>
              <p>
                <strong>Сумма:</strong> {Number(bet.amount)} wei
              </p>
              <p>
                <strong>Создатель:</strong> {bet.creator}
              </p>
              <p>
                <strong>Статус:</strong> {["Open", "Accepted", "Resolved", "Cancelled"][bet.status]}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Нет активных пари.</p>
      )}
    </div>
  );
};

export default BetList;
