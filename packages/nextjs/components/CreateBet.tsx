import React, { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

/**
 * Компонент для создания нового пари.
 * Пользователь может указать условие пари и сумму (в ETH), которую он ставит.
 */
const CreateBet: React.FC = () => {
  const [condition, setCondition] = useState<string>(""); // Условие пари
  const [amount, setAmount] = useState<string>(""); // Сумма ставки

  const { writeContractAsync, isMining } = useScaffoldWriteContract({ contractName: "BetContract" });

  /**
   * Обработчик отправки формы для создания пари.
   */
  const handleSubmit = async () => {
    if (!condition || !amount) {
      alert("Введите условие и сумму"); // Проверка ввода
      return;
    }

    try {
      // Вызов функции createBet с передачей ETH
      await writeContractAsync({
        functionName: "createBet", // Функция смарт-контракта для создания пари
        value: amount as unknown as bigint,
        args: [condition],
      });
      alert("Пари успешно создано!");
    } catch (error) {
      console.error(error);
      alert("Ошибка создания пари");
    }
  };

  return (
    <div className="p-4 border rounded shadow-lg">
      <h2 className="text-lg font-bold mb-2">Создать пари</h2>
      {/* Поле ввода для условия пари */}
      <input
        type="text"
        placeholder="Условие пари"
        value={condition}
        onChange={e => setCondition(e.target.value)}
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
      {/* Кнопка для отправки */}
      <button onClick={handleSubmit} className="btn btn-primary" disabled={isMining}>
        {isMining ? "Создание..." : "Создать пари"}
      </button>
    </div>
  );
};

export default CreateBet;
