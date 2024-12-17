"use client";

import AcceptBet from "~~/components/AcceptBet";
import BetList from "~~/components/BetList";
import CancelBet from "~~/components/CancelBet";
import CreateBet from "~~/components/CreateBet";
import ResolveBet from "~~/components/ResolveBet";

/**
 * Главная страница приложения.
 * Содержит компоненты для работы с пари.
 */
const Home = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">Приложение для пари</h1>
      <CreateBet /> {/* Компонент для создания пари */}
      <BetList /> {/* Компонент для отображения списка пари */}
      <AcceptBet /> {/* Компонент для принятия пари */}
      <ResolveBet /> {/* Компонент для разрешения пари */}
      <CancelBet /> {/* Компонент для отмены пари */}
    </div>
  );
};

export default Home;
