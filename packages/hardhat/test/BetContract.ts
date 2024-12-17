import { expect } from "chai";

import { ethers } from "hardhat";

describe("BetContract", function () {
  let betContract: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    // Деплой контракта перед каждым тестом
    [owner, user1, user2] = await ethers.getSigners();
    const BetContract = await ethers.getContractFactory("BetContract");
    betContract = await BetContract.deploy();
  });

  it("должен позволять создавать пари", async function () {
    const condition = "Сможет ли команда A победить?";
    const betAmount = ethers.parseEther("1");

    // Создание пари
    await expect(betContract.connect(user1).createBet(condition, { value: betAmount }))
      .to.emit(betContract, "BetCreated") // Проверка события
      .withArgs(0, user1.address, betAmount, condition);

    // Проверка данных пари
    const bet = await betContract.bets(0);
    expect(bet.creator).to.equal(user1.address);
    expect(bet.amount).to.equal(betAmount);
    expect(bet.condition).to.equal(condition);
    expect(bet.status).to.equal(0); // Ожидание: статус Open
  });

  it("должен позволять принимать пари", async function () {
    const condition = "Сможет ли команда A победить?";
    const betAmount = ethers.parseEther("1");

    // Создание пари
    await betContract.connect(user1).createBet(condition, { value: betAmount });

    // Принятие пари
    await expect(betContract.connect(user2).acceptBet(0, { value: betAmount }))
      .to.emit(betContract, "BetAccepted") // Проверка события
      .withArgs(0, user2.address);

    // Проверка данных пари после принятия
    const bet = await betContract.bets(0);
    expect(bet.taker).to.equal(user2.address);
    expect(bet.status).to.equal(1); // Ожидание: статус Accepted
  });

  it("должен разрешать пари", async function () {
    const condition = "Сможет ли команда A победить?";
    const betAmount = ethers.parseEther("1");

    // Создание и принятие пари
    await betContract.connect(user1).createBet(condition, { value: betAmount });
    await betContract.connect(user2).acceptBet(0, { value: betAmount });

    // Разрешение пари
    await expect(betContract.connect(user1).resolveBet(0, user1.address))
      .to.emit(betContract, "BetResolved") // Проверка события
      .withArgs(0, user1.address);

    // Проверка статуса пари
    const bet = await betContract.bets(0);
    expect(bet.status).to.equal(2); // Ожидание: статус Resolved

    // Проверка перевода средств
    const user1BalanceAfter = await ethers.provider.getBalance(user1.address);
    expect(user1BalanceAfter).to.be.above(2n);
  });

  it("должен позволять отменять пари", async function () {
    const condition = "Сможет ли команда A победить?";
    const betAmount = ethers.parseEther("1");

    // Создание пари
    await betContract.connect(user1).createBet(condition, { value: betAmount });

    // Отмена пари
    await expect(betContract.connect(user1).cancelBet(0))
      .to.emit(betContract, "BetCancelled") // Проверка события
      .withArgs(0);

    // Проверка статуса пари
    const bet = await betContract.bets(0);
    expect(bet.status).to.equal(3); // Ожидание: статус Cancelled

    // Проверка возврата средств
    const user1BalanceAfter = await ethers.provider.getBalance(user1.address);
    expect(user1BalanceAfter).to.be.above(betAmount);
  });

  it("не должен позволять принимать пари, если ставки не совпадают", async function () {
    const condition = "Сможет ли команда A победить?";
    const betAmount = ethers.parseEther("1");

    // Создание пари
    await betContract.connect(user1).createBet(condition, { value: betAmount });

    // Попытка принять пари с меньшей ставкой
    await expect(betContract.connect(user2).acceptBet(0, { value: ethers.parseEther("0.5") })).to.be.revertedWith(
      "Bet amount mismatch",
    );
  });

  it("не должен позволять разрешать пари не создателю", async function () {
    const condition = "Сможет ли команда A победить?";
    const betAmount = ethers.parseEther("1");

    // Создание и принятие пари
    await betContract.connect(user1).createBet(condition, { value: betAmount });
    await betContract.connect(user2).acceptBet(0, { value: betAmount });

    // Попытка разрешить пари пользователем, который не является создателем
    await expect(betContract.connect(user2).resolveBet(0, user2.address)).to.be.revertedWith(
      "Only creator can resolve",
    );
  });
});
