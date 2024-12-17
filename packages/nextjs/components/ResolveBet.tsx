import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Компонент для разрешения пари.
 * Позволяет указать ID и адрес победителя для завершения пари.
 */
const ResolveBet: React.FC = () => {
  const [betId, setBetId] = useState<string>(""); // ID пари
  const [winner, setWinner] = useState<string>(""); // Адрес победителя

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "BetContract" });

  /**
   * Обработчик отправки формы для разрешения пари.
   */
  const handleSubmit = async () => {
    if (!betId || !winner) {
      alert("Введите ID пари и адрес победителя"); // Проверка ввода
      return;
    }

    try {
      // Вызов функции resolveBet
      await writeContractAsync({
        functionName: "resolveBet",
        args: [BigInt(betId), winner],
      });
      alert("Пари успешно разрешено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка разрешения пари");
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Разрешить пари</h2>
      {/* Поле ввода для ID пари */}
      <input
        type="number"
        placeholder="ID пари"
        value={betId}
        onChange={e => setBetId(e.target.value)}
        className="input input-bordered w-full mb-2"
      />
      {/* Поле ввода для адреса победителя */}
      <input
        type="text"
        placeholder="Адрес победителя"
        value={winner}
        onChange={e => setWinner(e.target.value)}
        className="input input-bordered w-full mb-2"
      />
      {/* Кнопка для отправки */}
      <button onClick={handleSubmit} className="btn btn-primary" disabled={isMining}>
        {isMining ? "Разрешение..." : "Разрешить пари"}
      </button>
    </div>
  );
};

export default ResolveBet;
