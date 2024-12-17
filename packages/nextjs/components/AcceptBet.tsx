import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Компонент для принятия существующего пари.
 * Пользователь указывает ID пари и отправляет ETH для его принятия.
 */
const AcceptBet: React.FC = () => {
  const [betId, setBetId] = useState<string>(""); // ID пари
  const [amount, setAmount] = useState<string>(""); // Сумма ставки

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "BetContract" });

  /**
   * Обработчик отправки формы для принятия пари.
   */
  const handleSubmit = async () => {
    if (!betId || !amount) {
      alert("Введите ID пари и сумму");
      return;
    }

    try {
      // Вызов функции acceptBet
      await writeContractAsync({
        functionName: "acceptBet",
        value: BigInt(amount),
        args: [BigInt(betId)],
      });
      alert("Пари принято успешно!");
    } catch (error) {
      console.error(error);
      alert("Ошибка принятия пари");
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Принять пари</h2>
      {/* Поле ввода для ID пари */}
      <input
        type="number"
        placeholder="ID пари"
        value={betId}
        onChange={e => setBetId(e.target.value)}
        className="input input-bordered w-full mb-2"
      />
      {/* Поле ввода для суммы ставки */}
      <input
        type="number"
        placeholder="Сумма (в ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        className="input input-bordered w-full mb-2"
      />
      {/* Кнопка для принятия пари */}
      <button onClick={handleSubmit} className="btn btn-primary" disabled={isMining}>
        {isMining ? "Принятие..." : "Принять пари"}
      </button>
    </div>
  );
};

export default AcceptBet;
