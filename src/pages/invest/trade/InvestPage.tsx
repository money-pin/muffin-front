import { useEffect, useMemo, useState } from "react";

import InvestCompleteModal from "@/pages/invest/trade/components/InvestCompleteModal";
import InvestAssetCard from "@/pages/invest/trade/components/InvestAssetCard";
import InvestAssetCountBar from "@/pages/invest/trade/components/InvestAssetCountBar";
import InvestBottomAction from "@/pages/invest/trade/components/InvestBottomAction";
import InvestBudgetCard from "@/pages/invest/trade/components/InvestBudgetCard";
import InvestConfirmBottomSheet from "@/pages/invest/trade/components/InvestConfirmBottomSheet";
import InvestTodayStatusPage from "@/pages/invest/trade/components/InvestTodayStatusPage";
import InvestWeekendClosedPage from "@/pages/invest/trade/components/InvestWeekendClosedPage";

import { getInvestmentSectors } from "@/pages/invest/trade/apis/investmentApi";
import { INVEST_ASSET_SECTIONS } from "@/pages/invest/trade/constants/investAsset";
import { MOCK_INVEST_MARKET_DATA } from "@/pages/invest/trade/mocks/mockInvestMarketData";

import type {
  InvestmentSectorsResult,
  InvestAssetId,
} from "@/pages/invest/trade/types/invest";

// 자산 구매 현황 저장
type AssetQuantityMap = Partial<Record<InvestAssetId, number>>;

// 투자 페이지 모드
type InvestViewMode = "trade" | "summary" | "edit";

// 개발 중 주말에도 투자 화면을 확인해야 하면 true로 변경
// PR 올리기 전에는 false로 돌려두는 것을 권장
const FORCE_TRADE_VIEW_FOR_DEV = false;

function getKstDate() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
}

function getIsKstWeekend() {
  const kstNow = getKstDate();
  const day = kstNow.getDay();

  return day === 0 || day === 6;
}

// 총 투자 금액 계산
function getTotalInvestAmount(
  assetQuantities: AssetQuantityMap,
  unitAmount: number,
) {
  return Object.values(assetQuantities).reduce((sum, quantity) => {
    return sum + unitAmount * (quantity ?? 0);
  }, 0);
}

// 수정 버튼용 수량 체크
function isSameQuantityMap(
  current: AssetQuantityMap,
  confirmed: AssetQuantityMap,
) {
  const assetIds = new Set([
    ...Object.keys(current),
    ...Object.keys(confirmed),
  ]);

  return Array.from(assetIds).every((assetId) => {
    const typedAssetId = assetId as InvestAssetId;

    return (current[typedAssetId] ?? 0) === (confirmed[typedAssetId] ?? 0);
  });
}

function InvestPage() {
  const isWeekend = getIsKstWeekend();
  const shouldShowWeekendClosedPage = isWeekend && !FORCE_TRADE_VIEW_FOR_DEV;

  const [sectorData, setSectorData] =
    useState<InvestmentSectorsResult | null>(null);
  const [sectorErrorMessage, setSectorErrorMessage] = useState("");

  const [viewMode, setViewMode] = useState<InvestViewMode>("trade");
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<InvestAssetId | null>(
    null,
  );

  const [assetQuantities, setAssetQuantities] = useState<AssetQuantityMap>({});
  const [confirmedQuantities, setConfirmedQuantities] =
    useState<AssetQuantityMap>({});
  const [isConfirmSheetOpen, setIsConfirmSheetOpen] = useState(false);

  useEffect(() => {
    const fetchInvestmentSectors = async () => {
      try {
        const data = await getInvestmentSectors();

        setSectorData(data);
        setSectorErrorMessage("");
      } catch (error) {
        console.error("섹터 목록 조회 실패:", error);
        setSectorErrorMessage("투자 섹터 정보를 불러오지 못했어요.");
      }
    };

    fetchInvestmentSectors();
  }, []);

  const allAssets = useMemo(() => {
    return INVEST_ASSET_SECTIONS.flatMap((section) => section.items);
  }, []);

  const allSectors = useMemo(() => {
    return sectorData?.groups.flatMap((group) => group.sectors) ?? [];
  }, [sectorData]);

  const sectorByCode = useMemo(() => {
    return new Map(allSectors.map((sector) => [sector.sectorCode, sector]));
  }, [allSectors]);

  const unitAmount = sectorData?.unitAmount ?? 100000;

  const selectedAsset = useMemo(() => {
    return allAssets.find((asset) => asset.id === selectedAssetId);
  }, [allAssets, selectedAssetId]);

  const selectedQuantity = selectedAssetId
    ? (assetQuantities[selectedAssetId] ?? 0)
    : 0;

  const selectedAssetPrice = selectedAssetId ? unitAmount : 0;

  const selectedAssetTotalAmount = selectedAssetPrice * selectedQuantity;

  const totalInvestAmount = getTotalInvestAmount(assetQuantities, unitAmount);

  const confirmedTotalInvestAmount = getTotalInvestAmount(
    confirmedQuantities,
    unitAmount,
  );

  const remainingBudget = Math.max(
    0,
    MOCK_INVEST_MARKET_DATA.totalBudget - totalInvestAmount,
  );

  // 확정 바텀시트에 보여줄 구매 목록
  const confirmItems = Object.entries(assetQuantities)
    .filter(([, quantity]) => (quantity ?? 0) > 0)
    .map(([assetId, quantity]) => {
      const typedAssetId = assetId as InvestAssetId;
      const asset = allAssets.find((item) => item.id === typedAssetId);
      const amount = unitAmount * (quantity ?? 0);
      const percentage =
        totalInvestAmount > 0
          ? Math.round((amount / totalInvestAmount) * 100)
          : 0;

      return {
        assetId: typedAssetId,
        name: asset?.name ?? "",
        icon: asset?.activeIcon ?? "",
        amount,
        percentage,
      };
    });

  // 오늘 투자 현황 화면에 보여줄 목록
  const todayStatusItems = Object.entries(confirmedQuantities)
    .filter(([, quantity]) => (quantity ?? 0) > 0)
    .map(([assetId, quantity]) => {
      const typedAssetId = assetId as InvestAssetId;
      const asset = allAssets.find((item) => item.id === typedAssetId);
      const amount = unitAmount * (quantity ?? 0);
      const percentage =
        confirmedTotalInvestAmount > 0
          ? Math.round((amount / confirmedTotalInvestAmount) * 100)
          : 0;

      return {
        assetId: typedAssetId,
        name: asset?.name ?? "",
        icon: asset?.activeIcon ?? "",
        amount,
        percentage,
      };
    });

  const canDecrease = selectedQuantity > 0;

  const canIncrease =
    selectedAssetPrice > 0 && remainingBudget >= selectedAssetPrice;

  const hasAnyInvestment = totalInvestAmount > 0;

  const hasAssetCountBar = Boolean(selectedAsset && selectedQuantity > 0);

  const isEditMode = viewMode === "edit";

  const isEditChanged =
    isEditMode && !isSameQuantityMap(assetQuantities, confirmedQuantities);

  // 하단 액션 버튼 종류
  const bottomActionVariant =
    isEditMode && isEditChanged
      ? "editSubmit"
      : isEditMode
        ? "editCancel"
        : "purchase";

  const tradePageBottomPadding = hasAssetCountBar ? "pb-[240px]" : "pb-[176px]";

  const handleAssetClick = (assetId: InvestAssetId) => {
    const asset = allAssets.find((item) => item.id === assetId);
    const sector = asset ? sectorByCode.get(asset.sectorCode) : undefined;

    // 서버 섹터 목록에 없는 카드는 선택하지 않음
    if (!sector) return;

    setSelectedAssetId(assetId);

    setAssetQuantities((prev) => {
      const currentQuantity = prev[assetId] ?? 0;
      const currentTotalAmount = getTotalInvestAmount(prev, unitAmount);

      if (
        currentTotalAmount + unitAmount >
        MOCK_INVEST_MARKET_DATA.totalBudget
      ) {
        return prev;
      }

      return {
        ...prev,
        [assetId]: currentQuantity + 1,
      };
    });
  };

  // 수량 감소
  const handleDecrease = () => {
    if (!selectedAssetId) return;

    setAssetQuantities((prev) => {
      const currentQuantity = prev[selectedAssetId] ?? 0;
      const nextQuantity = Math.max(0, currentQuantity - 1);

      if (nextQuantity === 0) {
        const next = { ...prev };
        delete next[selectedAssetId];

        setSelectedAssetId(null);

        return next;
      }

      return {
        ...prev,
        [selectedAssetId]: nextQuantity,
      };
    });
  };

  // 수량 증가
  const handleIncrease = () => {
    if (!selectedAssetId || !canIncrease) return;

    setAssetQuantities((prev) => {
      const currentQuantity = prev[selectedAssetId] ?? 0;

      return {
        ...prev,
        [selectedAssetId]: currentQuantity + 1,
      };
    });
  };

  const handleReset = () => {
    setSelectedAssetId(null);
    setAssetQuantities({});
  };

  // 구매하기 버튼 -> 확인 바텀시트 오픈
  const handlePurchase = () => {
    if (!hasAnyInvestment) return;

    setIsConfirmSheetOpen(true);
  };

  // 이슈 1에서는 아직 서버 저장 X
  // 다음 이슈에서 Swagger 기준으로 confirm API 연결 예정
  const handleConfirmPurchase = () => {
    setConfirmedQuantities(assetQuantities);
    setIsConfirmSheetOpen(false);
    setIsCompleteModalOpen(true);
  };

  const handleCompleteModalConfirm = () => {
    setIsCompleteModalOpen(false);
    setSelectedAssetId(null);
    setViewMode("summary");
  };

  const handleStartEdit = () => {
    const firstConfirmedAssetId =
      allAssets.find((asset) => (confirmedQuantities[asset.id] ?? 0) > 0)?.id ??
      null;

    setAssetQuantities(confirmedQuantities);
    setSelectedAssetId(firstConfirmedAssetId);
    setViewMode("edit");
  };

  const handleEditCancel = () => {
    setAssetQuantities(confirmedQuantities);
    setSelectedAssetId(null);
    setViewMode("summary");
  };

  const handleEditSubmit = () => {
    if (!hasAnyInvestment) return;

    setIsConfirmSheetOpen(true);
  };

  return (
    <>
      {shouldShowWeekendClosedPage ? (
        <div className="-mb-[80px] flex flex-1 flex-col">
          <InvestWeekendClosedPage />
        </div>
      ) : viewMode === "summary" ? (
        <div className="-mb-[80px] flex flex-1 flex-col">
          <InvestTodayStatusPage
            items={todayStatusItems}
            onEdit={handleStartEdit}
          />
        </div>
      ) : (
        <div
          className={[
            "-mb-[80px] flex flex-1 flex-col gap-5 bg-[var(--color-neutral-50)] px-5 pt-5",
            tradePageBottomPadding,
          ].join(" ")}
        >
          <InvestBudgetCard
            totalBudget={MOCK_INVEST_MARKET_DATA.totalBudget}
            remainingBudget={remainingBudget}
          />

          {sectorErrorMessage && (
            <p className="text-[length:var(--text-caption-12-md)] leading-[var(--text-caption-12-md--line-height)] font-[var(--text-caption-12-md--font-weight)] text-[var(--color-primary)]">
              {sectorErrorMessage}
            </p>
          )}

          {INVEST_ASSET_SECTIONS.map((section) => (
            <div key={section.id} className="flex flex-col gap-2">
              <h2 className="text-[length:var(--text-body-16-bd-tighter)] leading-[var(--text-body-16-bd-tighter--line-height)] font-[var(--text-body-16-bd-tighter--font-weight)] text-[var(--color-neutral-900)]">
                {section.title}
              </h2>

              <div className="grid grid-cols-4 gap-[10px]">
                {section.items.map((asset) => {
                  const quantity = assetQuantities[asset.id] ?? 0;
                  const sector = sectorByCode.get(asset.sectorCode);
                  const isDisabled = !sector;

                  const isSelected =
                    selectedAssetId === asset.id && quantity > 0;
                  const isPurchased =
                    selectedAssetId !== asset.id && quantity > 0;

                  return (
                    <InvestAssetCard
                      key={asset.id}
                      name={asset.name}
                      icon={asset.icon}
                      activeIcon={asset.activeIcon}
                      status={
                        isSelected
                          ? "selected"
                          : isPurchased
                            ? "purchased"
                            : "default"
                      }
                      quantity={quantity}
                      onClick={() => {
                        if (isDisabled) return;
                        handleAssetClick(asset.id);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {selectedAsset && selectedQuantity > 0 && (
            <InvestAssetCountBar
              name={selectedAsset.name}
              totalAmount={selectedAssetTotalAmount}
              quantity={selectedQuantity}
              canDecrease={canDecrease}
              canIncrease={canIncrease}
              onDecrease={handleDecrease}
              onIncrease={handleIncrease}
            />
          )}

          <InvestBottomAction
            selectedTotalAmount={totalInvestAmount}
            variant={bottomActionVariant}
            showTopShadow={!hasAssetCountBar}
            onReset={handleReset}
            onPurchase={handlePurchase}
            onEditCancel={handleEditCancel}
            onEditSubmit={handleEditSubmit}
          />
        </div>
      )}

      <InvestConfirmBottomSheet
        isOpen={isConfirmSheetOpen}
        items={confirmItems}
        totalAmount={totalInvestAmount}
        onClose={() => setIsConfirmSheetOpen(false)}
        onConfirm={handleConfirmPurchase}
      />

      <InvestCompleteModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onConfirm={handleCompleteModalConfirm}
      />
    </>
  );
}

export default InvestPage;