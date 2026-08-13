import automobileIcon from "@/assets/investment/investment-automobile.svg";
import biotechIcon from "@/assets/investment/investment-biotech.svg";
import bondsIcon from "@/assets/investment/investment-bonds.svg";
import coinIcon from "@/assets/investment/investment-coin.svg";
import defenseIcon from "@/assets/investment/investment-defense.svg";
import depositIcon from "@/assets/investment/investment-deposit.svg";
import dollarIcon from "@/assets/investment/investment-dollar.svg";
import energyIcon from "@/assets/investment/investment-energy.svg";
import financialsIcon from "@/assets/investment/investment-financials.svg";
import goldIcon from "@/assets/investment/investment-gold.svg";
import semiconductorIcon from "@/assets/investment/investment-semiconductor.svg";
import technologyIcon from "@/assets/investment/investment-technology.svg";

export type InvestSectorCode =
  | "AUTO"
  | "BIO"
  | "BOND"
  | "CRYPTO"
  | "DEFENSE"
  | "DEPOSIT"
  | "ENERGY"
  | "FINANCE"
  | "GOLD"
  | "SEMICONDUCTOR"
  | "TECH"
  | "USD";

interface SectorMeta {
  code: string;
  name: string;
  iconSrc: string;
}

const SECTOR_META_BY_CODE: Record<InvestSectorCode, SectorMeta> = {
  AUTO: {
    code: "AUTO",
    name: "자동차",
    iconSrc: automobileIcon,
  },
  BIO: {
    code: "BIO",
    name: "바이오/제약",
    iconSrc: biotechIcon,
  },
  BOND: {
    code: "BOND",
    name: "채권",
    iconSrc: bondsIcon,
  },
  CRYPTO: {
    code: "CRYPTO",
    name: "코인",
    iconSrc: coinIcon,
  },
  DEFENSE: {
    code: "DEFENSE",
    name: "방산",
    iconSrc: defenseIcon,
  },
  DEPOSIT: {
    code: "DEPOSIT",
    name: "예금",
    iconSrc: depositIcon,
  },
  ENERGY: {
    code: "ENERGY",
    name: "에너지",
    iconSrc: energyIcon,
  },
  FINANCE: {
    code: "FINANCE",
    name: "금융",
    iconSrc: financialsIcon,
  },
  GOLD: {
    code: "GOLD",
    name: "금",
    iconSrc: goldIcon,
  },
  SEMICONDUCTOR: {
    code: "SEMICONDUCTOR",
    name: "반도체",
    iconSrc: semiconductorIcon,
  },
  TECH: {
    code: "TECH",
    name: "테크",
    iconSrc: technologyIcon,
  },
  USD: {
    code: "USD",
    name: "달러",
    iconSrc: dollarIcon,
  },
};

export function getSectorMeta(sectorCode: string, fallbackName?: string) {
  const normalizedCode = sectorCode.trim().toUpperCase();

  if (isInvestSectorCode(normalizedCode)) {
    return SECTOR_META_BY_CODE[normalizedCode];
  }

  return {
    code: normalizedCode,
    name: fallbackName ?? normalizedCode,
    iconSrc: depositIcon,
  };
}

function isInvestSectorCode(value: string): value is InvestSectorCode {
  return value in SECTOR_META_BY_CODE;
}
