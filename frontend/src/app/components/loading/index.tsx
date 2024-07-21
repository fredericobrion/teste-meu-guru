import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center my-40">
      <ClipLoader color="#741174" size={80} />
      <h3 className="mt-4 text-2xl font-semibold text-gray-700">Carregando...</h3>
    </div>
  );
}
