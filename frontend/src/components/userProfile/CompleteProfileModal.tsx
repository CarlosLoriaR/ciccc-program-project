import { FiX } from 'react-icons/fi';
import InterestSelector from './InterestSelector';

const DISMISS_KEY = 'profileReminderDismissed';

const CompleteProfileModal = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm px-4">
      <div className=" relative w-full max-w-md md:max-w-3xl bg-white rounded-3xl shadow-xl p-8">
        <button
          onClick={}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors"
        >
          <FiX size={22} />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Complete your profile
          </h1>
          <p className="text-on-surface-variant mt-1">
            Let others know a bit more about you.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <AvatarUpload onFileSelect={(file, url) => console.log(file, url)} />
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Bio
            </label>
            <textarea
              placeholder="Tell others a bit about yourself..."
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium border border-transparent focus:border-primary focus:outline-none transition-colors placeholder:text-outline placeholder:font-normal resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Interests
            </label>
            <InterestSelector selected={interests} onChange={setInterests} />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-container hover:text-on-primary transition-colors"
          >
            Finish Setup
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full text-center text-primary hover:text-primary-container font-semibold transition-colors"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
