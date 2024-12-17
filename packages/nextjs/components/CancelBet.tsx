import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Компонент для отмены пари.
 * Позволяет создателю пари указать ID и отменить его, если еще не завершено.
 */
const CancelBet: React.FC = () => {
  const [betId, setBetId] = useState<string>(""); // ID пари

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "BetContract" });

  /**
   * Обработчик отправки формы для отмены пари.
   */
  const handleSubmit = async () => {
    if (!betId) {
      alert("Введите ID пари"); // Проверка ввода
      return;
    }

    try {
      // Вызов функции cancelBet
      await writeContractAsync({
        functionName: "cancelBet",
        args: [BigInt(betId)],
      });
      alert("Пари успешно отменено!");
    } catch (error) {
      console.error(error);
      alert("Ошибка отмены пари");
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Отменить пари</h2>
      {/* Поле ввода для ID пари */}
      <input
        type="number"
        placeholder="ID пари"
        value={betId}
        onChange={e => setBetId(e.target.value)}
        className="input input-bordered w-full mb-2"
      />
      {/* Кнопка для отправки */}
      <button onClick={handleSubmit} className="btn btn-primary" disabled={isMining}>
        {isMining ? "Отмена..." : "Отменить пари"}
      </button>
    </div>
  );
};

export default CancelBet;
