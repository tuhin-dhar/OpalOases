import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";

type Props = {
  type: "HOTEL" | "ROOM";
};

function ImagesSection({ type }: Props) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls");

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => {
        return url !== imageUrl;
      })
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <h3 className="my-3 text-lg font-semibold">
        {type === "HOTEL"
          ? "Upload Images of your hotel"
          : "Upload images of the room you are uploading"}
      </h3>
      <div className="border rounded p-4 flex flex-col gap-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((imageUrl) => (
              <div className="relative group">
                <img src={imageUrl} className="min-h-full object-cover" />
                <button
                  onClick={(event) => handleDelete(event, imageUrl)}
                  className="absolute text-white inset-0 flex items-center justify-center bg-black  opacity-0 group-hover:opacity-100 hover:bg-opacity-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="w-full text-gray-700 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles.length + (existingImageUrls?.length || 0);
              if (totalLength === 0) {
                return "Atleast one image is required";
              }

              if (totalLength > 6) {
                return "You can only upload 6 images";
              }

              return true;
            },
          })}
        />
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-bold">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
}

export default ImagesSection;
