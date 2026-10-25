import { Link } from "react-router-dom";

function SubscriptionModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscription-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
              Anime Sensei
            </p>
            <h2 id="subscription-modal-title" className="mt-1 text-2xl font-bold text-gray-900">
              Currently not available for your current tier
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 text-2xl leading-none text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close subscription modal"
          >
            &times;
          </button>
        </div>
        <p className="text-sm leading-relaxed text-gray-600">
          This episode does not have a playable public YouTube source. Upgrade
          your plan to unlock more episode access when premium streaming is
          available.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/guide"
            onClick={onClose}
            className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            View plans
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Continue browsing
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionModal;
