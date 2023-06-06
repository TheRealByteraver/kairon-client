import { FieldValues } from "react-hook-form/dist/types"; // had to add this type import manually for some reason...
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button from "./UI/Button";

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
      className="mt-4 pt-4 flex flex-row flex-1 items-stretch"
    >
      <div className="relative flex flex-col w-96">
        <label
          htmlFor="tokenInput"
          className="absolute -top-3 left-3 px-2 text-md font-normal bg-white"
        >
          Token ID
        </label>
        <input
          id="tokenInput"
          type="text"
          placeholder="enter token id..."
          {...register("token")}
          className="mr-5 block p-2 h-12 outline-none border border-black rounded-lg"
        />

        {/* the .toString() is added to prevent a TS error */}
        <p>{errors.token?.message?.toString()}</p>
      </div>
      <Button type="submit">ADD</Button>
    </form>
  );
};

export default TokenForm;
