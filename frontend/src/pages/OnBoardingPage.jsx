import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import toast, { LoaderIcon } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeOnBoarding } from "../lib/api";
import { CameraIcon, MapPin, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { LANGUAGES } from "../constants";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: completeOnBoarding,
    onSuccess: () => {
      toast.success("Onboarding completed successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "An error occurred";
      const missingFields = error.response?.data?.missingFields;

      if (Array.isArray(missingFields) && missingFields.length > 0) {
        const formattedFields = missingFields
          .map((field) => `- ${field}`)
          .join("\n");
        toast.error(`${message}\nMissing Fields:\n${formattedFields}`);
      } else {
        toast.error(message);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBoardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 200) + 1;
    // const randomAvatar = `https://api.multiavatar.com/${idx}.png`;
    const randomAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${idx}`;

    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Avatar Changed Successfully");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* profile pic container */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* image preview  */}

              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* generate random avatar  */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* language  */}
            <div className="grid grid-col-1 md:grid-col-2 gap-4">
              {/* native language  */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select Your Native Language</option>
                  {LANGUAGES.map((lang) => {
                    return (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* learning language  */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option>Select The Language You're Learning</option>
                  {LANGUAGES.map((lang) => {
                    return (
                      <option
                        key={`learning-${lang}`}
                        value={lang.toLowerCase()}
                      >
                        {lang}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* location  */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPin className="absolute z-1 top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />

                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered pl-10 w-full"
                  placeholder="City, Country"
                />
              </div>
            </div>

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
