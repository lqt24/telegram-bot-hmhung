
const fs = require('fs');
const path = require('path');

const moneyFilePath = "./database/money.json"
const loadMoneyData = () => {
  if (fs.existsSync(moneyFilePath)) {
    return JSON.parse(fs.readFileSync(moneyFilePath, 'utf8'));
  }
  return {};
};

const saveMoneyData = (data) => {
  fs.writeFileSync(moneyFilePath, JSON.stringify(data, null, 2), 'utf8');
};

const moneyData = loadMoneyData();

const getMoney = (userId) => {
  return moneyData[userId] || 0; 
};

const addMoney = (userId, amount) => {
  if (!moneyData[userId]) {
    moneyData[userId] = 0; 
  }
  moneyData[userId] += amount;
  saveMoneyData(moneyData);
};

const subtractMoney = (userId, amount) => {
  if (!moneyData[userId]) {
    moneyData[userId] = 0; 
  }
  moneyData[userId] = Math.max(moneyData[userId] - amount, 0); 
  saveMoneyData(moneyData);
};

module.exports = {
  getMoney,
  addMoney,
  subtractMoney
};
