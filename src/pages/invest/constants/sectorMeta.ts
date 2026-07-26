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

const SECTOR_META_BY_CODE: Record<string, SectorMeta> = {
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
    name: "예적금",
    iconSrc: depositIcon,
  },
  USD: {
    code: "USD",
    name: "달러",
    iconSrc: dollarIcon,
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
};

// TODO: 기존 mock data와 이전 섹터 코드 호환용 alias입니다.
// mock data를 API 표준 sectorCode로 정리한 뒤 제거를 검토합니다.
const SECTOR_CODE_ALIASES: Record<string, InvestSectorCode> = {
  AUTOMOBILE: "AUTO",
  BIOTECH: "BIO",
  BIOTECH_PHARMA: "BIO",
  BONDS: "BOND",
  COIN: "CRYPTO",
  DOLLAR: "USD",
  FINANCIALS: "FINANCE",
  IT: "TECH",
  TECHNOLOGY: "TECH",
};

export function getSectorMeta(sectorCode: string, fallbackName?: string) {
  const normalizedCode = sectorCode.trim().toUpperCase();
  const code = SECTOR_CODE_ALIASES[normalizedCode] ?? normalizedCode;

  if (isInvestSectorCode(code)) return SECTOR_META_BY_CODE[code];

  return {
    code: normalizedCode,
    name: fallbackName ?? normalizedCode,
    iconSrc: depositIcon,
  };
}

function isInvestSectorCode(value: string): value is InvestSectorCode {
  return value in SECTOR_META_BY_CODE;
}
