import bullseyeIcon from "@/assets/icon-20px/bullseye.svg";
import type { InvestmentProfile } from "@/pages/invest/stats/types";

interface InvestmentStyleCardProps {
  profile: InvestmentProfile;
}

export default function InvestmentStyleCard({
  profile,
}: InvestmentStyleCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl border border-neutral-100 bg-neutral-0 p-5">
      <div className="flex w-full items-center gap-1 px-1">
        <img
          src={bullseyeIcon}
          alt=""
          aria-hidden="true"
          className="h-5 w-5 object-contain"
          draggable={false}
        />
        <h2 className="text-body-16-bd-tighter leading-[1.6] text-neutral-900">
          나의 투자 성향
        </h2>
      </div>

      <div className="flex w-full items-center justify-center rounded-xl border border-primary-300 py-3">
        <p className="text-heading-18-bd text-primary">{profile.type}</p>
      </div>

      <p className="pl-1 text-body-14-md-tighter text-neutral-900">
        {profile.description}
      </p>

      <ul className="flex flex-col gap-2 pl-1.5">
        {profile.details.map((detail) => (
          <li key={detail} className="flex items-center gap-2">
            <span className="h-1 w-1 shrink-0 rounded-full bg-neutral-600" />
            <span className="text-caption-12-md text-neutral-400">
              {detail}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
