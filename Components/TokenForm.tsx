import { FieldValues } from "react-hook-form/dist/types"; // had to add this type import manually for some reason...
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const TokenForm: React.FC<{ addToken: (token: string) => void }> = ({
  addToken,
}) => {
  const schema = yup.object().shape({
    token: yup
      .string()
      .required("Please enter a valid token id")
      .trim()
      .matches(
        /^[a-z0-9-]+$/,
        "The token should be lowercase, without spaces or any special characters."
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), defaultValues: { token: "" } });

  const onSubmit = (data: FieldValues) => {
    addToken(data.token);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 pt-4 pl-2 flex flex-row flex-1 items-stretch"
    >
      <div className="relative flex flex-col w-96">
        <label
          htmlFor="tokenInput"
          className="absolute -top-3 left-3 px-2 text-md font-semibold bg-white"
        >
          Token ID
        </label>
        <input
          id="tokenInput"
          type="text"
          placeholder="enter token id..."
          {...register("token")}
          className="block p-2 h-12 outline-none border border-black rounded-lg"
        />

        {/* the .toString() is added to prevent a TS error */}
        <p>{errors.token?.message?.toString()}</p>
      </div>
      <button
        type="submit"
        className="ml-5 h-12 py-2 px-12 rounded-lg bg-green-600 text-white"
      >
        ADD
      </button>
    </form>
  );
};

export default TokenForm;
