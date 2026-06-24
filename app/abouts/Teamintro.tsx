import "./TeamIntro.css";

export default function TeamIntro() {
  return (
    <div className="team-intro">
      <p className="team-eyebrow">Our people</p>
      <h2 className="team-heading">
        Meet our team
        <svg
          className="team-underline"
          width="170"
          height="14"
          viewBox="0 0 170 14"
          aria-hidden="true"
        >
          <path
            d="M3 9 Q 30 1, 55 8 T 110 7 T 167 6"
            stroke="#D97706"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </h2>
      <p className="team-subtext">
        The hands behind every harvest — say hello to the people who keep our
        farm growing.
      </p>
    </div>
  );
}