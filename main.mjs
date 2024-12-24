// trading-calculator-enhanced.mjs
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const calculatePosition = (
  entryPrice,
  stopLossPrice,
  takeProfitPrice = null,
  riskAmount = 50
) => {
  // Basic calculations
  const riskPercentage = ((entryPrice - stopLossPrice) / entryPrice) * 100;
  const priceDifference = entryPrice - stopLossPrice;
  const positionSizeCoins = riskAmount / priceDifference;
  const positionSizeDollars = positionSizeCoins * entryPrice;

  // Leverage calculations
  const leverageX20 = {
    coins: positionSizeCoins / 20,
    dollars: positionSizeDollars / 20,
    margin: positionSizeDollars / 20,
    totalPosition: positionSizeDollars,
  };

  const leverageX50 = {
    coins: positionSizeCoins / 50,
    dollars: positionSizeDollars / 50,
    margin: positionSizeDollars / 50,
    totalPosition: positionSizeDollars,
  };

  // Take Profit calculations
  let takeProfitInfo = null;
  if (takeProfitPrice) {
    const profitAmount = (takeProfitPrice - entryPrice) * positionSizeCoins;
    const rewardPercentage =
      ((takeProfitPrice - entryPrice) / entryPrice) * 100;
    const riskRewardRatio = rewardPercentage / riskPercentage;

    takeProfitInfo = {
      price: takeProfitPrice,
      profitAmount,
      rewardPercentage,
      riskRewardRatio,
    };
  }

  return {
    entryPrice,
    stopLossPrice,
    riskPercentage,
    positionSizeCoins,
    positionSizeDollars,
    riskAmount,
    leverageX20,
    leverageX50,
    takeProfitInfo,
  };
};

const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(num);
};

const askQuestions = () => {
  rl.question("Enter entry price: ", (entry) => {
    rl.question("Enter stop loss price: ", (stopLoss) => {
      rl.question(
        "Enter take profit price (press Enter to skip): ",
        (takeProfit) => {
          const result = calculatePosition(
            parseFloat(entry),
            parseFloat(stopLoss),
            takeProfit ? parseFloat(takeProfit) : null
          );

          console.log("\n📊 Trading Position Calculator");
          console.log("============================");

          console.log("\n🎯 Basic Position Information");
          console.log(`Entry Price: $${formatNumber(result.entryPrice)}`);
          console.log(`Stop Loss: $${formatNumber(result.stopLossPrice)}`);
          console.log(
            `Risk Percentage: ${formatNumber(result.riskPercentage)}%`
          );
          console.log(`Risk Amount: $${formatNumber(result.riskAmount)}`);

          if (result.takeProfitInfo) {
            console.log("\n🎯 Take Profit Information");
            console.log(
              `Take Profit Price: $${formatNumber(result.takeProfitInfo.price)}`
            );
            console.log(
              `Potential Profit: $${formatNumber(
                result.takeProfitInfo.profitAmount
              )}`
            );
            console.log(
              `Reward Percentage: ${formatNumber(
                result.takeProfitInfo.rewardPercentage
              )}%`
            );
            console.log(
              `Risk/Reward Ratio: 1:${formatNumber(
                result.takeProfitInfo.riskRewardRatio
              )}`
            );
          }

          console.log("\n💰 Spot Position (No Leverage)");
          console.log(
            `Position Size (Coins): ${formatNumber(result.positionSizeCoins)}`
          );
          console.log(
            `Position Size (USD): $${formatNumber(result.positionSizeDollars)}`
          );

          console.log("\n⚡ 20x Leverage Position");
          console.log(
            `Required Margin: $${formatNumber(result.leverageX20.margin)}`
          );
          console.log(
            `Position Size (Coins): ${formatNumber(result.leverageX20.coins)}`
          );
          console.log(
            `Position Size (USD): $${formatNumber(result.leverageX20.dollars)}`
          );
          console.log(
            `Total Position Value: $${formatNumber(
              result.leverageX20.totalPosition
            )}`
          );

          console.log("\n🚀 50x Leverage Position");
          console.log(
            `Required Margin: $${formatNumber(result.leverageX50.margin)}`
          );
          console.log(
            `Position Size (Coins): ${formatNumber(result.leverageX50.coins)}`
          );
          console.log(
            `Position Size (USD): $${formatNumber(result.leverageX50.dollars)}`
          );
          console.log(
            `Total Position Value: $${formatNumber(
              result.leverageX50.totalPosition
            )}`
          );

          console.log("\n⚠️ Risk Warning:");
          console.log("- Higher leverage means higher risk of liquidation");
          console.log(
            "- Make sure to understand the risks before using leverage"
          );
          console.log("- These calculations assume cross margin mode");

          if (result.takeProfitInfo) {
            const { riskRewardRatio } = result.takeProfitInfo;
            if (riskRewardRatio < 2) {
              console.log("\n⚠️ Trade Warning:");
              console.log("- Risk/Reward ratio is less than 1:2");
              console.log(
                "- Consider adjusting your take profit or stop loss levels"
              );
            }
          }

          rl.close();
        }
      );
    });
  });
};

askQuestions();
