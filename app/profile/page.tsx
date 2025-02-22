import FormContainer from '@/components/form/FormContainer';
import { updateProfile, fetchProfile, updateProfileImage } from '@/utils/actions';
import FormInput from '@/components/form/FormInput';
import { SubmitButton } from "@/components/form/Button"
import ImageInputContainer from '@/components/form/ImageInputContainer';

async function ProfilePage() {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-8 capitalize">User Profile</h1>
      <div className="border p-8 rounded-md">
        {/* Profile image and details */}
        <div>
          <ImageInputContainer
            image={profile.profileImage}
            name={profile.username}
            action={updateProfileImage}
            text="Update Profile Image"
          />
          <FormContainer action={updateProfile}>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <FormInput
                type="text"
                name="firstName"
                label="First Name"
                defaultValue={profile.firstName}
              />
              <FormInput
                type="text"
                name="lastName"
                label="Last Name"
                defaultValue={profile.lastName}
              />
              <FormInput
                type="text"
                name="username"
                label="Username"
                defaultValue={profile.username}
              />
            </div>
            <SubmitButton text="Update Profile" className="mt-8" />
          </FormContainer>
        </div>

        {/* Enroll with FaceIO */}
      </div>
    </section>
  );
}

export default ProfilePage;
