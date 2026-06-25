import "./TeamIntro.css";

export default function Aboutheader() {
  return (
    <div className="team-intro">
      <p className="team-eyebrow"> About </p>
      <h2 className="team-heading">
        About Our Farm
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
        Our farm has over 20+ years of experience in agriculture and livestock management. We are proud to be one of the most trusted and top-rated farms in the region, delivering fresh, natural, and high-quality products. Our mission is to promote healthy farming and sustainable agriculture for future generations.
      </p>
    </div>
  );
}