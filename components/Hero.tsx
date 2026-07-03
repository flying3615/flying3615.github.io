import WordsPullUp from './animation/WordsPullUp';
import WordsPullUpMultiStyle from './animation/WordsPullUpMultiStyle';

export default function Hero() {
  return (
    <div className="hero">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero-bg-video"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />
      <div className="noise-overlay hero-noise" />
      <div className="hero-grad-1" />
      <div className="hero-grad-2" />

      <div className="hero-content">
        <div className="hero-eyebrow">Portfolio · Selected Work</div>
        <h1 className="hero-h1">
          <div><WordsPullUp text="Selected" /></div>
          <div><WordsPullUp text="Work" /></div>
        </h1>
        <p className="hero-desc">
          <WordsPullUpMultiStyle
            segments={[
              { text: "Systems I've shipped across banking, government, gaming and telecom — and" },
              { text: 'open-source work on the side.', className: 'italic-accent' },
              { text: 'Click any project to expand the detail.' },
            ]}
          />
        </p>
      </div>
    </div>
  );
}
