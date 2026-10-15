import { Icon } from "@/components/Icon";
import { Mark } from "@/components/Mark";
import { brand } from "@/lib/brand";
import { defaultContent } from "@/lib/site";

// Decorative left half of the sign-in page: the editor on a laptop, and the website on a phone updating as the
// headline is "typed" and saved. Pure CSS animation (see .showcase in admin.css); a still picture with reduced
// motion. It only uses the site's own default text, so it never shows made-up prices or offers.
export function LoginShowcase() {
  const { headline, headlineAccent } = defaultContent.home.hero;
  return (
    <div className="showcase" aria-hidden="true">
      <div className="showcase-glow" />
      <div className="showcase-copy">
        <span className="showcase-brand">
          <Mark />
          {brand.name}
        </span>
        <p className="showcase-title">
          Your website, <span>in your hands.</span>
        </p>
        <p className="showcase-text">Change text, prices, specials and photos yourself. Save once and the website updates within seconds.</p>
      </div>

      <div className="stage">
        <div className="mock-laptop">
          <div className="mock-chrome">
            <i />
            <i />
            <i />
            <span className="mock-url">
              <Icon name="lock" className="icon-xxs" />
              rapidselfstorage.com/admin
            </span>
          </div>
          <div className="mock-app">
            <div className="mock-side">
              <span className="mock-logo">
                <Mark />
              </span>
              <b />
              <b className="on" />
              <b />
              <b />
              <b />
              <b />
            </div>
            <div className="mock-main">
              <p className="mock-h">Homepage text</p>
              <div className="mock-card">
                <p className="mock-label">Headline (white part)</p>
                <p className="mock-input">{headline}</p>
                <p className="mock-label">Headline (blue part)</p>
                <p className="mock-input is-typing">
                  <span className="mock-typed">{headlineAccent}</span>
                </p>
              </div>
              <div className="mock-save">
                <span className="mock-btn">Save changes</span>
                <span className="mock-toast">
                  <Icon name="check" className="icon-xxs" />
                  Saved. Your website is updated.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mock-phone">
          <div className="phone-island" />
          <div className="phone-screen">
            <div className="ps-header">
              <Mark />
              <span />
              <em>Reserve</em>
            </div>
            <div className="ps-hero">
              <div className="ps-doors" />
              <p>
                {headline} <span>{headlineAccent}</span>
              </p>
              <em>Reserve a unit</em>
            </div>
            <div className="ps-facts">
              <span />
              <span />
            </div>
            <div className="ps-plan">
              <i />
            </div>
          </div>
        </div>

        <span className="chip chip-a">
          <Icon name="bolt" className="icon-xs" />
          Live in seconds
        </span>
        <span className="chip chip-b">
          <Icon name="undo" className="icon-xs" />
          Undo any change
        </span>
        <span className="chip chip-c">
          <Icon name="shield" className="icon-xs" />
          Private and secure
        </span>
      </div>
    </div>
  );
}
