export default function GlowingArc({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        className="glowing-path"
        d="M40 320C220 120 420 90 640 180C820 254 980 230 1160 90"
        stroke="#00F2FF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
