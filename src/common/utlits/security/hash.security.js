import { hashSync, compareSync } from "bcrypt";

export const hash = ({
  plainText,
  salt_round = process.env.SALT_ROUNDS,
} = {}) => {
  return hashSync(plainText, Number(salt_round));
};
export const compare = ({ plainText, cipherText } = {}) => {
  return compareSync(plainText, cipherText);
};
