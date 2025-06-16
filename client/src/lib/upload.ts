const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const uploadToBackend = async (file: File) : Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/remove-background/`, {
    method: "POST",
    body: formData,
  });

  const blob = await response.blob();
  const resultUrl = URL.createObjectURL(blob);
  return resultUrl;
};