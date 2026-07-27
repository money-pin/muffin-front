import automobileIcon from "@/assets/investment/investment-automobile-disabled.svg";
import automobileActiveIcon from "@/assets/investment/investment-automobile.svg";

import biotechIcon from "@/assets/investment/investment-biotech-disabled.svg";
import biotechActiveIcon from "@/assets/investment/investment-biotech.svg";

import bondsIcon from "@/assets/investment/investment-bonds-disabled.svg";
import bondsActiveIcon from "@/assets/investment/investment-bonds.svg";

import coinIcon from "@/assets/investment/investment-coin-disabled.svg";
import coinActiveIcon from "@/assets/investment/investment-coin.svg";

import defenseIcon from "@/assets/investment/investment-defense-disabled.svg";
import defenseActiveIcon from "@/assets/investment/investment-defense.svg";

import depositIcon from "@/assets/investment/investment-deposit-disabled.svg";
import depositActiveIcon from "@/assets/investment/investment-deposit.svg";

import dollarIcon from "@/assets/investment/investment-dollar-disabled.svg";
import dollarActiveIcon from "@/assets/investment/investment-dollar.svg";

import energyIcon from "@/assets/investment/investment-energy-disabled.svg";
import energyActiveIcon from "@/assets/investment/investment-energy.svg";

import financialsIcon from "@/assets/investment/investment-financials-disabled.svg";
import financialsActiveIcon from "@/assets/investment/investment-financials.svg";

import goldIcon from "@/assets/investment/investment-gold-disabled.svg";
import goldActiveIcon from "@/assets/investment/investment-gold.svg";

import semiconductorIcon from "@/assets/investment/investment-semiconductor-disabled.svg";
import semiconductorActiveIcon from "@/assets/investment/investment-semiconductor.svg";

import technologyIcon from "@/assets/investment/investment-technology-disabled.svg";
import technologyActiveIcon from "@/assets/investment/investment-technology.svg";

import type { InvestAssetSection } from "@/pages/invest/trade/types/invest";

export const INVEST_ASSET_SECTIONS: InvestAssetSection[] = [
  {
    id: "basic-assets",
    title: "기초자산",
    items: [
      {
        id: "deposit",
        name: "예금",
        icon: depositIcon,
        activeIcon: depositActiveIcon,
        sectorCode: "DEPOSIT",
      },
      {
        id: "gold",
        name: "금",
        icon: goldIcon,
        activeIcon: goldActiveIcon,
        sectorCode: "GOLD",
      },
      {
        id: "dollar",
        name: "달러",
        icon: dollarIcon,
        activeIcon: dollarActiveIcon,
        sectorCode: "DOLLAR",
      },
      {
        id: "bonds",
        name: "채권",
        icon: bondsIcon,
        activeIcon: bondsActiveIcon,
        sectorCode: "BONDS",
      },
    ],
  },
  {
    id: "future-tech",
    title: "미래 기술&혁신",
    items: [
      {
        id: "coin",
        name: "코인",
        icon: coinIcon,
        activeIcon: coinActiveIcon,
        sectorCode: "COIN",
      },
      {
        id: "biotech",
        name: "바이오",
        icon: biotechIcon,
        activeIcon: biotechActiveIcon,
        sectorCode: "BIOTECH",
      },
      {
        id: "semiconductor",
        name: "반도체",
        icon: semiconductorIcon,
        activeIcon: semiconductorActiveIcon,
        sectorCode: "SEMICONDUCTOR",
      },
      {
        id: "technology",
        name: "테크",
        icon: technologyIcon,
        activeIcon: technologyActiveIcon,
        sectorCode: "TECHNOLOGY",
      },
    ],
  },
  {
    id: "real-economy",
    title: "실물 경제&인프라",
    items: [
      {
        id: "energy",
        name: "에너지",
        icon: energyIcon,
        activeIcon: energyActiveIcon,
        sectorCode: "ENERGY",
      },
      {
        id: "financials",
        name: "금융",
        icon: financialsIcon,
        activeIcon: financialsActiveIcon,
        sectorCode: "FINANCIALS",
      },
      {
        id: "automobile",
        name: "자동차",
        icon: automobileIcon,
        activeIcon: automobileActiveIcon,
        sectorCode: "AUTOMOBILE",
      },
      {
        id: "defense",
        name: "방산",
        icon: defenseIcon,
        activeIcon: defenseActiveIcon,
        sectorCode: "DEFENSE",
      },
    ],
  },
];