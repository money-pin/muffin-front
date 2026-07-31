import logo from "@/assets/logo.svg";

// 온보딩 완료 스텝 자금 카드 (Figma: 284×160, radius16, primary→secondary 그라데이션)
export default function StartFundCard() {
  return (
    <div
      className="flex h-[160px] w-[284px] max-w-full flex-col items-start gap-6 rounded-[16px] p-5 drop-shadow-[0px_2px_3px_rgba(0,0,0,0.25)]"
      style={{
        backgroundImage:
          "linear-gradient(150.6deg, #f46c0e 36.78%, #ff9900 59.27%, #ffc266 73.08%, #ff9900 82.18%, #f46c0e 91.33%)",
      }}
    >
      <div className="flex items-start gap-2">
        <img
          src={logo}
          alt="Muffin"
          className="h-[19px] w-[55px] object-contain brightness-0 invert"
          draggable={false}
        />
        <span className="text-body-14-md text-white">시작 자금</span>
      </div>

      <div className="flex items-center gap-1 text-white">
        <span className="text-[28px] leading-[1.3] font-bold tracking-[0.4px]">
          1,000,000
        </span>
        <span className="text-[28px] leading-[1.3] font-bold">원</span>
      </div>
    </div>
  );
}
